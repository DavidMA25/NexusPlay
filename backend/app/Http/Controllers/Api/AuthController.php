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
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'player',
        ]);

        event(new Registered($user));

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
            'email_verified' => false,
        ], 201);
    }

    // Authenticates a user and returns an API token
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

    // Returns the currently authenticated user with their profile and stats
    public function user(Request $request)
    {
        $user = $request->user()->load(['profile', 'stats']);
        return response()->json([
            ...$user->toArray(),
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }

    // Updates the authenticated user's profile settings, including avatar and games
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

    // Logs out the user by deleting their current access token
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    // Resends the email verification notification
    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'The email is already verified.'], 422);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent.']);
    }

    // Updates the user's email address and requires re-verification
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
        $user->email_verified_at = null; 
        $user->save();

        return response()->json(['message' => 'Email updated successfully. Please verify your new email.']);
    }

    // Updates the user's password
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

    // Deletes the user's account and associated tokens
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully.']);
    }

    // Updates the user's notification preferences
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
