<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TryoutParticipant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TryoutController extends Controller
{
    // -------------------------------------------------------------------------
    // GET /tryouts/{wpPostId}/participants
    // Devuelve los participantes de un tryout (identificado por su ID de WP).
    // Público: WordPress lo consume para mostrar participantes en el single-tryout.
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // POST /tryouts/{wpPostId}/join
    // Authenticated user registers for a tryout.
    // Rules: cannot join if already registered; team owner cannot join their own tryout.
    // -------------------------------------------------------------------------
    public function join(Request $request, int $wpPostId): JsonResponse
    {
        $user = $request->user();

        // Prevent the team owner from joining their own tryout.
        // The WP post meta _nexusplay_team_id links the tryout to a Laravel team.
        // We read it directly from the shared wp_postmeta table.
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

        // Check if already registered.
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

    // -------------------------------------------------------------------------
    // DELETE /tryouts/{wpPostId}/leave
    // El usuario cancela su inscripción (solo si está en estado 'registered').
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // PATCH /tryouts/{wpPostId}/participants/{participantId}
    // Update participant status.
    // Only the team owner of the tryout (identified via wp_postmeta) can do this.
    // WordPress editors/admins use the plugin REST endpoint instead.
    // -------------------------------------------------------------------------
    public function updateStatus(Request $request, int $wpPostId, int $participantId): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:registered,approved,rejected',
        ]);

        $user = $request->user();

        // Resolve team ownership from the shared wp_postmeta table
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

    // -------------------------------------------------------------------------
    // GET /tryouts/{wpPostId}/my-status
    // Current user's enrollment status for a tryout.
    // Also returns is_owner so the frontend can hide the Join button for team owners.
    // -------------------------------------------------------------------------
    public function myStatus(Request $request, int $wpPostId): JsonResponse
    {
        $user        = $request->user();
        $participant = TryoutParticipant::where('wp_post_id', $wpPostId)
            ->where('user_id', $user->id)
            ->first();

        // Check ownership via shared wp_postmeta table.
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

    // -------------------------------------------------------------------------
    // GET /tryouts/my-participations
    // Returns the list of wp_post_ids the authenticated user has registered for.
    // Used by the "Participating" filter tab in the React events page.
    // -------------------------------------------------------------------------
    public function myParticipations(Request $request): JsonResponse
    {
        $ids = TryoutParticipant::where('user_id', $request->user()->id)
            ->pluck('wp_post_id')
            ->map(fn ($id) => (int) $id)
            ->values();

        return response()->json(['wp_post_ids' => $ids]);
    }
}
