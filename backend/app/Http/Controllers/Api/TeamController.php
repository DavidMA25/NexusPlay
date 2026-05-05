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

    public function myTeams()
    {
        $userId = auth()->id();
        $teams = Team::where('owner_id', $userId)
            ->orWhereHas('members', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->with(['owner', 'members'])
            ->get();
        return TeamResource::collection($teams);
    }

    public function store(StoreTeamRequest $request)
    {
        $data = $request->validated();
        
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('teams', 'public');
            $data['logo_url'] = '/storage/' . $path;
        }

        $team = Team::create([
            ...$data,
            'owner_id' => auth()->id()
        ]);

        $conversation = \App\Models\Conversation::create([
            'is_group' => true,
            'group_name' => $team->name,
            'owner_id' => auth()->id()
        ]);
        $conversation->participants()->attach(auth()->id());

        if ($request->has('members')) {
            $memberIds = json_decode($request->input('members'), true);
            if (is_array($memberIds)) {
                foreach ($memberIds as $memberId) {
                    $team->members()->attach($memberId, [
                        'role_in_team' => 'member',
                        'joined_at' => now()
                    ]);
                    $conversation->participants()->attach($memberId);
                }
            }
        }

        return new TeamResource($team->load(['owner', 'members']));
    }

    public function show(Team $team)
    {
        return new TeamResource(
            $team->load('members', 'owner')
        );
    }

    public function update(StoreTeamRequest $request, Team $team)
    {
        if (auth()->id() !== $team->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validated();
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('teams', 'public');
            $data['logo_url'] = '/storage/' . $path;
        }

        $team->update($data);
        return new TeamResource($team);
    }

    public function destroy(Team $team)
    {
        if (auth()->id() !== $team->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        $team->delete();
        return response()->noContent();
    }

    public function addMember(Request $request, Team $team)
    {
        if (auth()->id() !== $team->owner_id) {
            abort(403, 'Unauthorized action.');
        }
        $request->validate(['user_id' => 'required|exists:users,id']);
        
        if (!$team->members()->where('user_id', $request->user_id)->exists()) {
            $team->members()->attach($request->user_id, [
                'role_in_team' => 'member',
                'joined_at' => now()
            ]);
        }
        return response()->json(['message' => 'Member added']);
    }

    public function removeMember(Team $team, $userId)
    {
        if (auth()->id() !== $team->owner_id) {
            abort(403, 'Unauthorized action.');
        }
        $team->members()->detach($userId);
        return response()->noContent();
    }
}
