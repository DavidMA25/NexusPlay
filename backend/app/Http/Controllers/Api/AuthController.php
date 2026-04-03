<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'sometimes|in:player,team',
            'team_name' => 'required_if:role,team|string|max:255',
            'region' => 'required_if:role,team|string|max:100',
            'website' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);

        $userRole = (isset($data['role']) && $data['role'] === 'team') ? 'recruiter' : 'player';

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $userRole,
        ]);

        if (isset($data['role']) && $data['role'] === 'team') {
            \App\Models\Team::create([
                'owner_id' => $user->id,
                'name' => $data['team_name'],
                'region' => $data['region'],
                'website' => $data['website'] ?? null,
                'description' => $data['description'] ?? null,
            ]);
        }

        event(new Registered($user));

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
            'email_verified' => false,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user()->load(['profile', 'stats']);
        return response()->json([
            ...$user->toArray(),
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'language' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:100',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            if ($user->avatar_url) {
                $oldPath = str_replace('/storage/', '', $user->avatar_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar_url = '/storage/' . $path;
        }

        $user->name = $request->name;
        if ($request->has('bio')) {
            $user->bio = $request->bio;
        }
        $user->save();

        if ($request->has('language') || $request->has('region')) {
            $profile = $user->profile()->firstOrCreate(
                ['user_id' => $user->id],
                ['availability_status' => 'Available', 'languages' => '', 'region' => '']
            );

            if ($request->has('language')) {
                $profile->languages = $request->language;
            }
            if ($request->has('region')) {
                $profile->region = $request->region;
            }
            $profile->save();
        }

        if ($request->has('games')) {
            $games = json_decode($request->games, true);
            if (is_array($games)) {
                $user->stats()->delete();
                foreach ($games as $gameData) {
                    $user->stats()->create([
                        'game_igdb_id' => crc32($gameData['game'] ?? 'Unknown'),
                        'game_name' => $gameData['game'] ?? 'Unknown',
                        'rank_tier' => $gameData['rank'] ?? 'Unranked',
                        'platform' => $gameData['platform'] ?? 'PC',
                        'region' => $request->region ?? 'Global',
                        'role_main' => 'Flex',
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Profile settings updated successfully.',
            'user' => $user->load(['profile', 'stats'])
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'El email ya está verificado.'], 422);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Email de verificación reenviado.']);
    }
}
