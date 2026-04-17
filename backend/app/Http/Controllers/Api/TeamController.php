<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return TeamResource::collection(
            Team::with(['owner', 'members'])->paginate()
        );
    }

    public function store(StoreTeamRequest $request)
    {
        $team = Team::create([
            ...$request->validated(),
            'owner_id' => auth()->id()
        ]);

        return new TeamResource($team);
    }

    public function show(Team $team)
    {
        return new TeamResource(
            $team->load('members', 'owner')
        );
    }

    public function update(StoreTeamRequest $request, Team $team)
    {
        $team->update($request->validated());
        return new TeamResource($team);
    }

    public function destroy(Team $team)
    {
        $team->delete();
        return response()->noContent();
    }
}
