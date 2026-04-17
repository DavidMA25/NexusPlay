<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\{
    TeamController,
    VacancyController,
    PlayerStatController,
    PlayerProfileController,
    PlayerController,
    PlayerAdController,
    VacancyApplicationController,
    TryoutController
};

Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/players',    [PlayerController::class, 'index']);
Route::get('/player-ads', [PlayerAdController::class, 'index']);

// Vacancies are public so unauthenticated visitors can browse team ads (FindTeams page)
Route::get('/vacancies', [VacancyController::class, 'index']);

// Tryout participants — public so WordPress can read them for the single-tryout template
Route::get('/tryouts/{wpPostId}/participants', [TryoutController::class, 'participants'])
    ->where('wpPostId', '[0-9]+');

Route::middleware('auth:sanctum')->group(function () {

    // Session & verification
    Route::get('/user',          [AuthController::class, 'user']);
    Route::post('/logout',       [AuthController::class, 'logout']);
    Route::post('/user/settings',[AuthController::class, 'updateSettings']);

    Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
        $user = \App\Models\User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Enlace de verificación inválido.'], 403);
        }
        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'El enlace ha expirado o no es válido.'], 403);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'El email ya estaba verificado.']);
        }

        $user->markEmailAsVerified();
        return response()->json(['message' => 'Email verificado correctamente.']);
    })->name('verification.verify');

    Route::post('/email/resend', [AuthController::class, 'resendVerification']);

    // Teams
    Route::apiResource('teams', TeamController::class);

    // Vacancies (write operations require auth)
    Route::post('/vacancies',            [VacancyController::class, 'store']);
    Route::get('/vacancies/{vacancy}',   [VacancyController::class, 'show']);
    Route::put('/vacancies/{vacancy}',   [VacancyController::class, 'update']);
    Route::delete('/vacancies/{vacancy}',[VacancyController::class, 'destroy']);

    // Player profile & stats
    Route::get('profile',  [PlayerProfileController::class, 'show']);
    Route::post('profile', [PlayerProfileController::class, 'store']);
    Route::apiResource('player-stats', PlayerStatController::class);

    // Player ads
    Route::post('/player-ads',             [PlayerAdController::class, 'store']);
    Route::delete('/player-ads/{playerAd}',[PlayerAdController::class, 'destroy']);

    // Vacancy applications
    Route::post('applications',                    [VacancyApplicationController::class, 'store']);
    Route::patch('applications/{application}',     [VacancyApplicationController::class, 'updateStatus']);

    // Tryouts — join, leave, my status, manage participants
    Route::get('/tryouts/my-participations',  [TryoutController::class, 'myParticipations']);
    Route::post('/tryouts/{wpPostId}/join',   [TryoutController::class, 'join'])
        ->where('wpPostId', '[0-9]+');
    Route::delete('/tryouts/{wpPostId}/leave',[TryoutController::class, 'leave'])
        ->where('wpPostId', '[0-9]+');
    Route::get('/tryouts/{wpPostId}/my-status',[TryoutController::class, 'myStatus'])
        ->where('wpPostId', '[0-9]+');
    Route::patch('/tryouts/{wpPostId}/participants/{participantId}', [TryoutController::class, 'updateStatus'])
        ->where(['wpPostId' => '[0-9]+', 'participantId' => '[0-9]+']);
});
