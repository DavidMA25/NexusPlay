<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    
    // Searches and returns a paginated collection of users with optional filtering by game, region, rank, or role
    public function index(Request $request)
    {
        $query = User::with(['profile', 'stats']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nickname', 'like', "%{$search}%");
            });
        }

        if ($request->filled('region')) {
            $region = $request->input('region');
            $query->whereHas('profile', function ($q) use ($region) {
                $q->where('region', $region);
            });
        }

        if ($request->filled('game')) {
            $game = $request->input('game');

            $query->whereHas('stats', function ($q) use ($game) {
                $q->where('game_igdb_id', $game); 
            });
        }

        if ($request->filled('rank')) {
            $rank = $request->input('rank');
            $query->whereHas('stats', function ($q) use ($rank) {
                $q->where('rank_tier', 'like', "%{$rank}%");
            });
        }

        if ($request->filled('role')) {
            $role = $request->input('role');
            $query->whereHas('stats', function ($q) use ($role) {
                $q->where('role_main', 'like', "%{$role}%");
            });
        }

        $players = $query->paginate(12);

        return response()->json($players);
    }

    // Shows details of a single specific user by ID load with their game profile
    public function show($id)
    {
        $player = User::with(['profile', 'stats'])->findOrFail($id);
        return response()->json($player);
    }

    // Allows an admin role to fully delete another user account
    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            abort(400, 'Cannot delete yourself here.');
        }
        
        $user->tokens()->delete();
        $user->delete();
        
        return response()->noContent();
    }
}
