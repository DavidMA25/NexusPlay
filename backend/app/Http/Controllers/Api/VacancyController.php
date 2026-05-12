<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVacancyRequest;
use App\Http\Resources\VacancyResource;
use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    // Retrieves a paginated list of team vacancies, optionally filtered by search, region, game, and rank
    public function index(Request $request)
    {
        $query = Vacancy::with('team')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('team', function($t) use ($search) {
                      $t->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('region')) {
            $region = $request->region;
            $query->whereHas('team', function($t) use ($region) {
                $t->where('region', $region);
            });
        }

        if ($request->filled('game')) {
            $game = $request->game;
            
            if (is_numeric($game)) {
                $query->where('game_igdb_id', $game);
            } else {
                $query->whereHas('team', function($t) use ($game) {
                    $t->where('game_name', 'like', "%{$game}%");
                });
            }
        }

        if ($request->filled('rank')) {
            $rank = $request->rank;
            $query->where(function($q) use ($rank) {
                $q->where('required_rank_min', 'like', "%{$rank}%")
                  ->orWhere('required_rank_max', 'like', "%{$rank}%");
            });
        }

        return VacancyResource::collection(
            $query->paginate(10)
        );
    }

    // Creates a new team vacancy and notifies interested users
    public function store(StoreVacancyRequest $request)
    {
        $data = $request->validated();
        
        $team = \App\Models\Team::findOrFail($data['team_id']);
        if (auth()->id() !== $team->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        if (empty($data['title'])) {
            $data['title'] = "Buscamos jugador para " . $team->name;
        }

        $data['game_igdb_id'] = $data['game_igdb_id'] ?? $team->game_igdb_id ?? 1;

        $vacancy = Vacancy::create($data);

        $gameId = $vacancy->game_igdb_id;
        $region = $team->region; 
        $teamName = $team->name;

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
                'type' => 'vacancy_match',
                'data' => [
                    'vacancy_id' => $vacancy->id,
                    'game_name' => $vacancy->game_name ?? "Game #".$gameId,
                    'team_name' => $teamName,
                    'description' => \Illuminate\Support\Str::limit($vacancy->description, 50)
                ]
            ]);
        }

        return new VacancyResource($vacancy);
    }

    // Retrieves details for a specific team vacancy
    public function show(Vacancy $vacancy)
    {
        return new VacancyResource(
            $vacancy->load('team')
        );
    }

    // Updates a specific team vacancy
    public function update(StoreVacancyRequest $request, Vacancy $vacancy)
    {
        $vacancy->update($request->validated());

        return new VacancyResource($vacancy);
    }

    // Deletes a specific team vacancy (restricted to team owner or admin)
    public function destroy(Vacancy $vacancy)
    {
        $team = $vacancy->team;
        if (auth()->id() !== $team->owner_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $vacancy->delete();

        return response()->noContent();
    }
}
