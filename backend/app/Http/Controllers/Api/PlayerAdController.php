<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlayerAd;
use Illuminate\Http\Request;

class PlayerAdController extends Controller
{
    /**
     * List all player ads (public, paginated, with filters).
     */
    public function index(Request $request)
    {
        $query = PlayerAd::with(['user.profile', 'user.stats', 'stat']);

        // Search by username or nickname
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nickname', 'like', "%{$search}%");
            });
        }

        // Filter by region
        if ($request->filled('region')) {
            $region = $request->input('region');
            $query->whereHas('user.profile', function ($q) use ($region) {
                $q->where('region', $region);
            });
        }

        // Filter by game name
        if ($request->filled('game')) {
            $game = $request->input('game');
            $query->whereHas('stat', function ($q) use ($game) {
                $q->where('game_name', 'like', "%{$game}%");
            });
        }

        // Filter by rank
        if ($request->filled('rank')) {
            $rank = $request->input('rank');
            $query->whereHas('stat', function ($q) use ($rank) {
                $q->where('rank_tier', 'like', "%{$rank}%");
            });
        }

        $ads = $query->latest()->paginate(12);

        return response()->json($ads);
    }

    /**
     * Create a new player ad (authenticated).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'player_stat_id' => 'required|exists:player_stats,id',
            'message' => 'required|string|max:255',
        ]);

        // Verify the stat belongs to the authenticated user
        $stat = \App\Models\PlayerStat::findOrFail($validated['player_stat_id']);
        abort_if($stat->user_id !== auth()->id(), 403, 'This stat does not belong to you.');

        $ad = PlayerAd::create([
            'user_id' => auth()->id(),
            'player_stat_id' => $validated['player_stat_id'],
            'message' => $validated['message'],
        ]);

        $ad->load(['user.profile', 'stat']);

        // Notification matching logic
        $gameId = $stat->game_igdb_id;
        $region = auth()->user()->profile?->region;
        $creatorName = auth()->user()->nickname ?? auth()->user()->name;

        // Find users interested in this game and region
        $interestedUsers = \App\Models\User::where('id', '!=', auth()->id())
            ->whereHas('stats', function ($q) use ($gameId) {
                $q->where('game_igdb_id', $gameId);
            })
            ->whereHas('profile', function ($q) use ($region) {
                if ($region) {
                    $q->where('region', $region);
                }
            })
            ->get();

        foreach ($interestedUsers as $user) {
            \App\Models\Notification::createAndBroadcast([
                'user_id' => $user->id,
                'type' => 'ad_match',
                'data' => [
                    'ad_id' => $ad->id,
                    'game_name' => $stat->game_name,
                    'creator_name' => $creatorName,
                    'message' => \Illuminate\Support\Str::limit($ad->message, 50)
                ]
            ]);
        }

        return response()->json($ad, 201);
    }

    /**
     * Delete a player ad (only owner).
     */
    public function destroy(PlayerAd $playerAd)
    {
        abort_if($playerAd->user_id !== auth()->id(), 403);

        $playerAd->delete();

        return response()->noContent();
    }
}
