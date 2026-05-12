<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TryoutParticipant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TryoutController extends Controller
{

    // Gets the full list of user participation statuses for a WP-integrated team tryout
    public function participants(int $wpPostId): JsonResponse
    {
        $participants = TryoutParticipant::with('user:id,name,nickname,email,avatar_url,role')
            ->where('wp_post_id', $wpPostId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn ($p) => [
                'id'      => $p->id,
                'status'  => $p->status,
                'user'    => [
                    'id'       => $p->user->id,
                    'name'     => $p->user->name,
                    'nickname' => $p->user->nickname,
                    'email'    => $p->user->email,
                    'avatar'   => $p->user->avatar_url,
                    'role'     => $p->user->role,
                ],
            ]);

        return response()->json([
            'wp_post_id'   => $wpPostId,
            'total'        => $participants->count(),
            'approved'     => $participants->where('status', 'approved')->count(),
            'registered'   => $participants->where('status', 'registered')->count(),
            'rejected'     => $participants->where('status', 'rejected')->count(),
            'participants' => $participants->values(),
        ]);
    }

    // Registers a normal user as interested in an active recruitment event
    public function join(Request $request, int $wpPostId): JsonResponse
    {
        $user = $request->user();

        $teamId = \DB::table('wp_postmeta')
            ->where('post_id', $wpPostId)
            ->where('meta_key', '_nexusplay_team_id')
            ->value('meta_value');

        if ($teamId) {
            $team = \App\Models\Team::find((int) $teamId);
            if ($team && (int) $team->owner_id === (int) $user->id) {
                return response()->json([
                    'message' => 'You cannot join your own team\'s tryout.',
                ], 403);
            }
        }

        $existing = TryoutParticipant::where('wp_post_id', $wpPostId)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You are already registered for this tryout.',
                'status'  => $existing->status,
            ], 422);
        }

        $participant = TryoutParticipant::create([
            'wp_post_id' => $wpPostId,
            'user_id'    => $user->id,
            'status'     => 'registered',
        ]);

        return response()->json([
            'message'    => 'Successfully registered for the tryout.',
            'status'     => $participant->status,
            'wp_post_id' => $wpPostId,
        ], 201);
    }

    // Withdraws user current pending participation record from specific tryout event
    public function leave(Request $request, int $wpPostId): JsonResponse
    {
        $deleted = TryoutParticipant::where('wp_post_id', $wpPostId)
            ->where('user_id', $request->user()->id)
            ->where('status', 'registered')
            ->delete();

        if (! $deleted) {
            return response()->json([
                'message' => 'You cannot cancel this registration.',
            ], 422);
        }

        return response()->json(['message' => 'Registration cancelled.']);
    }

    // Lets the team owner set approved or rejected status to applicants
    public function updateStatus(Request $request, int $wpPostId, int $participantId): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:registered,approved,rejected',
        ]);

        $user = $request->user();

        $teamId = \DB::table('wp_postmeta')
            ->where('post_id', $wpPostId)
            ->where('meta_key', '_nexusplay_team_id')
            ->value('meta_value');

        if (!$teamId) {
            return response()->json([
                'message' => 'This tryout is not linked to a team.',
            ], 403);
        }

        $team = \App\Models\Team::find((int) $teamId);

        if (!$team || (int) $team->owner_id !== (int) $user->id) {
            return response()->json([
                'message' => 'Only the team owner can approve or reject participants.',
            ], 403);
        }

        $participant = TryoutParticipant::where('wp_post_id', $wpPostId)
            ->findOrFail($participantId);

        $participant->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated.',
            'status'  => $participant->status,
        ]);
    }

    // Checks current relation (owner, member, applicant) between user and the tryout
    public function myStatus(Request $request, int $wpPostId): JsonResponse
    {
        $user        = $request->user();
        $participant = TryoutParticipant::where('wp_post_id', $wpPostId)
            ->where('user_id', $user->id)
            ->first();

        $teamId  = \DB::table('wp_postmeta')
            ->where('post_id', $wpPostId)
            ->where('meta_key', '_nexusplay_team_id')
            ->value('meta_value');
        $isOwner = false;
        if ($teamId) {
            $team    = \App\Models\Team::find((int) $teamId);
            $isOwner = $team && (int) $team->owner_id === (int) $user->id;
        }

        return response()->json([
            'enrolled' => (bool) $participant,
            'status'   => $participant?->status,
            'is_owner' => $isOwner,
        ]);
    }

    public function myParticipations(Request $request): JsonResponse
    {
        $ids = TryoutParticipant::where('user_id', $request->user()->id)
            ->pluck('wp_post_id')
            ->map(fn ($id) => (int) $id)
            ->values();

        return response()->json(['wp_post_ids' => $ids]);
    }
}
