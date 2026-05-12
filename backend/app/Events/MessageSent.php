<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message) {}

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('conversation.' . $this->message->conversation_id),
        ];

        $this->message->conversation
            ->participants()
            ->where('user_id', '!=', $this->message->sender_id)
            ->pluck('user_id')
            ->each(function ($userId) use (&$channels) {
                $channels[] = new PrivateChannel('user.' . $userId);
            });

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        $sender       = $this->message->sender;
        $conversation = $this->message->conversation;

        $avatarUrl = null;
        if ($conversation->is_group) {
            $team = \App\Models\Team::where('conversation_id', $conversation->id)->first();
            $avatarUrl = $team?->logo_url;
        } else {
            $avatarUrl = $sender?->avatar_url;
        }

        return [
            'id'              => $this->message->id,
            'conversation_id' => $this->message->conversation_id,
            'sender_id'       => $this->message->sender_id,
            'sender_name'     => $sender?->name ?? 'Unknown',
            'sender_nickname' => $sender?->nickname,
            'sender_avatar'   => $sender?->avatar_url,
            'content'         => $this->message->content,
            'deleted_at'      => null,
            'created_at'      => $this->message->created_at->toISOString(),
            'conversation'    => [
                'id'          => $conversation->id,
                'is_group'    => $conversation->is_group,
                'group_name'  => $conversation->group_name,
                'owner_id'    => $conversation->owner_id,
                'avatar_url'  => $avatarUrl,
            ],
        ];
    }
}
