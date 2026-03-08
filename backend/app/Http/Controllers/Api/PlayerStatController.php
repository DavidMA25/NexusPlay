<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlayerStatRequest;
use App\Http\Resources\PlayerStatResource;
use App\Models\PlayerStat;
use Illuminate\Http\Request;

class PlayerStatController extends Controller
{
    public function index()
    {
        return PlayerStatResource::collection(
            auth()->user()->stats()->latest()->get()
        );
    }

    public function store(StorePlayerStatRequest $request)
    {
        $stat = PlayerStat::create([
            ...$request->validated(),
            'user_id' => auth()->id()
        ]);

        return new PlayerStatResource($stat);
    }

    public function update(StorePlayerStatRequest $request, PlayerStat $stat)
    {
        abort_if($stat->user_id !== auth()->id(), 403);

        $stat->update($request->validated());

        return new PlayerStatResource($stat);
    }

    public function destroy(PlayerStat $stat)
    {
        abort_if($stat->user_id !== auth()->id(), 403);

        $stat->delete();

        return response()->noContent();
    }
}
