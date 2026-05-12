<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageDeleted;
use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ConversationController extends Controller
{

    // Retrieves all conversations (direct and group) for the authenticated user, ordered by the latest message
    public function index(Request $request)
    {
        $userId = auth()->id();

        $conversations = Conversation::whereHas('participants', fn($q) => $q->where('users.id', $userId))
            ->with([
                'participants:id,name,nickname,avatar_url',
                'lastMessage.sender:id,name,nickname',
            ])
            ->withCount(['messages as unread_count' => function ($q) use ($userId) {
                $q->whereNull('deleted_at')
                  ->where('sender_id', '!=', $userId)
                  ->whereRaw('messages.created_at > COALESCE((
                      SELECT last_read_at FROM conversation_participants
                      WHERE conversation_participants.conversation_id = messages.conversation_id
                      AND conversation_participants.user_id = ?
                  ), "1970-01-01")', [$userId]);
            }])
            ->orderByDesc(function ($query) {
                $query->select('created_at')
                    ->from('messages')
                    ->whereColumn('conversation_id', 'conversations.id')
                    ->orderByDesc('created_at')
                    ->limit(1);
            })
            ->get();

        return response()->json($conversations->map(fn($c) => $this->formatConversation($c, $userId)));
    }

    // Finds an existing direct conversation with another user, or creates a new one
    public function findOrCreateDirect(Request $request)
    {
        $request->validate([
            'user_id' => [
                'required',
                'exists:users,id',
                Rule::notIn([auth()->id()]),
            ],
        ]);

        $userId  = auth()->id();
        $otherId = $request->user_id;

        $existing = Conversation::where('is_group', false)
            ->whereHas('participants', fn($q) => $q->where('users.id', $userId))
            ->whereHas('participants', fn($q) => $q->where('users.id', $otherId))
            ->whereDoesntHave('participants', fn($q) => $q->whereNotIn('users.id', [$userId, $otherId]))
            ->first();

        if ($existing) {
            $existing->load(['participants:id,name,nickname,avatar_url', 'lastMessage']);
            return response()->json($this->formatConversation($existing, $userId));
        }

        $conversation = DB::transaction(function () use ($userId, $otherId) {
            $conv = Conversation::create(['is_group' => false]);
            $conv->participants()->attach([$userId, $otherId]);
            return $conv;
        });

        $conversation->load(['participants:id,name,nickname,avatar_url', 'lastMessage']);
        return response()->json($this->formatConversation($conversation, $userId), 201);
    }

    // Creates a new group conversation with selected users
    public function createGroup(Request $request)
    {
        $request->validate([
            'group_name'  => 'required|string|max:100',
            'user_ids'    => 'required|array|min:2',
            'user_ids.*'  => 'exists:users,id',
        ]);

        $userId  = auth()->id();
        $members = array_unique($request->user_ids);

        if (in_array($userId, $members)) {
            return response()->json(['message' => 'You cannot add yourself to the group.'], 422);
        }

        foreach ($members as $memberId) {
            $hasTalked = Conversation::where('is_group', false)
                ->whereHas('participants', fn($q) => $q->where('users.id', $userId))
                ->whereHas('participants', fn($q) => $q->where('users.id', $memberId))
                ->exists();

            if (!$hasTalked) {
                $user = User::find($memberId);
                return response()->json([
                    'message' => 'You can only add users you have previously talked to.',
                    'user'    => $user?->nickname ?? $user?->name,
                ], 422);
            }
        }

        $conversation = DB::transaction(function () use ($userId, $members, $request) {
            $conv = Conversation::create([
                'is_group'   => true,
                'group_name' => $request->group_name,
                'owner_id'   => $userId,
            ]);
            $conv->participants()->attach(array_merge([$userId], $members));
            return $conv;
        });

        $conversation->load(['participants:id,name,nickname,avatar_url']);
        return response()->json($this->formatConversation($conversation, $userId), 201);
    }

    // Allows a user to leave a group conversation, or transfers ownership if the owner leaves
    public function leaveGroup(Conversation $conversation)
    {
        $this->authorizeParticipant($conversation);

        if (!$conversation->is_group) {
            return response()->json(['message' => 'This is not a group conversation.'], 400);
        }

        $userId  = auth()->id();
        $isOwner = $conversation->owner_id === $userId;

        $team = \App\Models\Team::where('conversation_id', $conversation->id)->first();

        if ($isOwner) {
            $nextOwner = $conversation->participants()
                ->where('users.id', '!=', $userId)
                ->orderBy('conversation_participants.created_at', 'asc')
                ->first();

            if ($nextOwner) {
                
                $conversation->update(['owner_id' => $nextOwner->id]);
                if ($team) {
                    $team->update(['owner_id' => $nextOwner->id]);
                }
            } else {
                
                $conversation->participants()->detach();
                $conversation->delete();
                if ($team) {
                    $team->members()->detach();
                    $team->delete();
                }
                return response()->noContent();
            }
        }

        $conversation->participants()->detach($userId);
        if ($team) {
            $team->members()->detach($userId);
        }

        return response()->noContent();
    }

    // Retrieves a paginated list of messages for a specific conversation
    public function messages(Request $request, Conversation $conversation)
    {
        $this->authorizeParticipant($conversation);

        $messages = $conversation->messages()
            ->with('sender:id,name,nickname,avatar_url')
            ->orderBy('created_at')
            ->paginate(50);

        $conversation->participants()->updateExistingPivot(auth()->id(), [
            'last_read_at' => now(),
        ]);

        return response()->json([
            'data' => $messages->items(),
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page'    => $messages->lastPage(),
                'total'        => $messages->total(),
            ],
        ]);
    }

    // Sends a new message in a conversation and broadcasts it via websockets
    public function sendMessage(Request $request, Conversation $conversation)
    {
        $this->authorizeParticipant($conversation);

        $request->validate(['content' => 'required|string|max:4000']);

        $message = $conversation->messages()->create([
            'sender_id' => auth()->id(),
            'content'   => $request->content,
        ]);

        $message->load('sender:id,name,nickname,avatar_url');

        $message->load('conversation.participants:id');

        $conversation->participants()->updateExistingPivot(auth()->id(), [
            'last_read_at' => now(),
        ]);

        broadcast(new MessageSent($message));

        $otherParticipants = $conversation->participants->where('id', '!=', auth()->id());
        foreach ($otherParticipants as $participant) {
            \App\Models\Notification::createAndBroadcast([
                'user_id' => $participant->id,
                'type' => 'new_message',
                'data' => [
                    'conversation_id' => $conversation->id,
                    'sender_name' => $message->sender->nickname ?? $message->sender->name,
                    'message_content' => \Illuminate\Support\Str::limit($message->content, 50),
                    'is_group' => $conversation->is_group,
                    'group_name' => $conversation->group_name
                ]
            ]);
        }

        return response()->json($message, 201);
    }

    // Soft deletes a message (restricted to the message sender or group owner)
    public function deleteMessage(Request $request, Conversation $conversation, Message $message)
    {
        $this->authorizeParticipant($conversation);

        $userId = auth()->id();

        $isOwner    = $conversation->is_group && $conversation->owner_id === $userId;
        $isMine     = $message->sender_id === $userId;

        if (!$isMine && !$isOwner) {
            return response()->json(['message' => 'You do not have permission to delete this message.'], 403);
        }

        $message->update(['deleted_at' => now(), 'content' => '']);

        broadcast(new MessageDeleted($message));

        return response()->noContent();
    }

    // Marks a conversation as read for the authenticated user
    public function markRead(Conversation $conversation)
    {
        $this->authorizeParticipant($conversation);

        $conversation->participants()->updateExistingPivot(auth()->id(), [
            'last_read_at' => now(),
        ]);

        return response()->noContent();
    }

    // Helper method to ensure the authenticated user is a participant in the conversation
    private function authorizeParticipant(Conversation $conversation): void
    {
        $isParticipant = $conversation->participants()
            ->where('user_id', auth()->id())
            ->exists();

        abort_unless($isParticipant, 403, 'You are not a participant of this conversation.');
    }

    // Helper method to format a conversation for the API response
    private function formatConversation(Conversation $conversation, int $userId): array
    {
        $lastMsg = $conversation->lastMessage;

        $otherUser = !$conversation->is_group
            ? $conversation->participants->firstWhere('id', '!=', $userId)
            : null;

        $displayName = $conversation->is_group
            ? ($conversation->group_name ?? "Group Chat")
            : ($otherUser?->nickname ?? $otherUser?->name ?? 'Unknown');

        $avatarUrl = null;
        if ($conversation->is_group) {
            $team = \App\Models\Team::where('conversation_id', $conversation->id)->first();
            $avatarUrl = $team?->logo_url;
        } else {
            $avatarUrl = $conversation->participants->firstWhere('id', '!=', $userId)?->avatar_url;
        }

        $otherUser = !$conversation->is_group
            ? $conversation->participants->firstWhere('id', '!=', $userId)
            : null;

        return [
            'id'           => $conversation->id,
            'is_group'     => $conversation->is_group,
            'name'         => $displayName,
            'group_name'   => $conversation->group_name,
            'owner_id'     => $conversation->owner_id,
            'avatar_url'   => $avatarUrl,
            'other_user_id'=> $otherUser?->id,
            'participants' => $conversation->participants->map(fn($p) => [
                'id'         => $p->id,
                'name'       => $p->name,
                'nickname'   => $p->nickname,
                'avatar_url' => $p->avatar_url,
            ]),
            'last_message' => $lastMsg ? [
                'content'    => $lastMsg->deleted_at ? '[Message deleted]' : $lastMsg->content,
                'sender_id'  => $lastMsg->sender_id,
                'created_at' => $lastMsg->created_at?->toISOString(),
            ] : null,
            'unread_count' => $conversation->unread_count ?? 0,
            'updated_at'   => $conversation->updated_at?->toISOString(),
        ];
    }
}
