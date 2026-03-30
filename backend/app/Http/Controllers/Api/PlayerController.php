<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    /**
     * Display a paginated listing of players (users with profiles and stats).
     */
    public function index(Request $request)
    {
        $query = User::with(['profile', 'stats']);

        // Search by name or nickname
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nickname', 'like', "%{$search}%");
            });
        }

        // Filter by region (in profile)
        if ($request->filled('region')) {
            $region = $request->input('region');
            $query->whereHas('profile', function ($q) use ($region) {
                $q->where('region', $region);
            });
        }

        // Filter by game (igdb_id in stats)
        if ($request->filled('game')) {
            $game = $request->input('game');
            // Assuming the frontend might pass a game name or ID, for now we will assume it filters exactly if it's an ID, or we need to join/map it. 
            // In the DB game_igdb_id is integer, so we assume frontend will send the ID if needed or we change this later.
            $query->whereHas('stats', function ($q) use ($game) {
                $q->where('game_igdb_id', $game); // Or handle text search depending on implementation
            });
        }

        // Filter by rank (in stats)
        if ($request->filled('rank')) {
            $rank = $request->input('rank');
            $query->whereHas('stats', function ($q) use ($rank) {
                $q->where('rank_tier', 'like', "%{$rank}%");
            });
        }
        
        // Filter by roles (in stats)
        if ($request->filled('role')) {
            $role = $request->input('role');
            $query->whereHas('stats', function ($q) use ($role) {
                $q->where('role_main', 'like', "%{$role}%");
            });
        }

        $players = $query->paginate(12);

        return response()->json($players);
    }
}
