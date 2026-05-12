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

        $userRole = 'player';

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
                'message' => 'Invalid credentials'
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
                    $gameName = $gameData['title'] ?? $gameData['game'] ?? 'Unknown';
                    $user->stats()->create([
                        'game_igdb_id' => $gameData['gameId'] ?? crc32($gameName),
                        'game_name' => $gameName,
                        'rank_tier' => $gameData['rank'] ?? 'Unranked',
                        'platform' => $gameData['platform'] ?? 'PC',
                        'region' => $request->region ?? 'Global',
                        'role_main' => $gameData['role'] ?? 'Flex',
                        'cover_url' => $gameData['cover_url'] ?? null,
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
            return response()->json(['message' => 'The email is already verified.'], 422);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent.']);
    }

    public function updateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
            'current_password' => 'required'
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->email = $request->email;
        $user->email_verified_at = null; // Require re-verification
        $user->save();

        return response()->json(['message' => 'Email updated successfully. Please verify your new email.']);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        
        // Let foreign key constraints handle deletions where possible,
        // or explicitly delete associated records here if necessary.
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully.']);
    }

    public function updateNotificationPreferences(Request $request)
    {
        $request->validate([
            'preferences' => 'required|array'
        ]);

        $user = $request->user();
        $user->notification_preferences = $request->preferences;
        $user->save();

        return response()->json(['message' => 'Notification preferences updated.', 'user' => $user]);
    }
}
