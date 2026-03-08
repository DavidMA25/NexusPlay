<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlayerProfileRequest;
use App\Http\Resources\PlayerProfileResource;
use App\Models\PlayerProfile;
use Illuminate\Http\Request;

class PlayerProfileController extends Controller
{
    public function show()
    {
        return new PlayerProfileResource(
            auth()->user()->profile
        );
    }

    public function store(StorePlayerProfileRequest $request)
    {
        $profile = PlayerProfile::updateOrCreate(
            ['user_id' => auth()->id()],
            $request->validated()
        );

        return new PlayerProfileResource($profile);
    }
}
