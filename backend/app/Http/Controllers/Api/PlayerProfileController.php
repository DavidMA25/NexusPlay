<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlayerProfileRequest;
use App\Http\Resources\PlayerProfileResource;
use App\Models\PlayerProfile;
use Illuminate\Http\Request;

class PlayerProfileController extends Controller
{
    // Retrieves and formats the current user's player profile
    public function show()
    {
        return new PlayerProfileResource(
            auth()->user()->profile
        );
    }

    // Creates or updates the player profile for the authenticated user
    public function store(StorePlayerProfileRequest $request)
    {
        $profile = PlayerProfile::updateOrCreate(
            ['user_id' => auth()->id()],
            $request->validated()
        );

        return new PlayerProfileResource($profile);
    }
}
