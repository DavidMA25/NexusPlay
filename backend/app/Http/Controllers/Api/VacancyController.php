<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVacancyRequest;
use App\Http\Resources\VacancyResource;
use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index()
    {
        return VacancyResource::collection(
            Vacancy::with('team')->latest()->paginate(5)
        );
    }

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
        
        // Ensure game_igdb_id is not null
        $data['game_igdb_id'] = $data['game_igdb_id'] ?? $team->game_igdb_id ?? 1;

        $vacancy = Vacancy::create($data);

        // Notification matching logic
        $gameId = $vacancy->game_igdb_id;
        $region = $team->region; // Assuming team has region or use owner's region
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

    public function show(Vacancy $vacancy)
    {
        return new VacancyResource(
            $vacancy->load('team')
        );
    }

    public function update(StoreVacancyRequest $request, Vacancy $vacancy)
    {
        $vacancy->update($request->validated());

        return new VacancyResource($vacancy);
    }

    public function destroy(Vacancy $vacancy)
    {
        $vacancy->delete();

        return response()->noContent();
    }
}
