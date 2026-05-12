<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlayerStatRequest;
use App\Http\Resources\PlayerStatResource;
use App\Models\PlayerStat;
use Illuminate\Http\Request;

class PlayerStatController extends Controller
{
    // Returns list of gaming statistics associated to the current user
    public function index()
    {
        return PlayerStatResource::collection(
            auth()->user()->stats()->latest()->get()
        );
    }

    // Saves a new entry of gaming rank, role, and platform statistics
    public function store(StorePlayerStatRequest $request)
    {
        $stat = PlayerStat::create([
            ...$request->validated(),
            'user_id' => auth()->id()
        ]);

        return new PlayerStatResource($stat);
    }

    // Updates existing stats verifying ownership before persisting
    public function update(StorePlayerStatRequest $request, PlayerStat $stat)
    {
        abort_if($stat->user_id !== auth()->id(), 403);

        $stat->update($request->validated());

        return new PlayerStatResource($stat);
    }

    // Removes a game statistics record owned by requesting user
    public function destroy(PlayerStat $stat)
    {
        abort_if($stat->user_id !== auth()->id(), 403);

        $stat->delete();

        return response()->noContent();
    }
}
