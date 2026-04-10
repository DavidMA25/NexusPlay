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
    VacancyApplicationController
};

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/players', [PlayerController::class, 'index']);
Route::get('/player-ads', [PlayerAdController::class, 'index']);
Route::get('/vacancies', [VacancyController::class, 'index']);

// Requiere token pero NO email verificado (gestión de sesión y verificación)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

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

    // Rutas del dashboard (requieren token, la verificación la gestiona el frontend)
    Route::post('/user/settings', [AuthController::class, 'updateSettings']);

    Route::apiResource('teams', TeamController::class);
    Route::post('/vacancies', [VacancyController::class, 'store']);
    Route::get('/vacancies/{vacancy}', [VacancyController::class, 'show']);
    Route::put('/vacancies/{vacancy}', [VacancyController::class, 'update']);
    Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy']);

    Route::get('profile', [PlayerProfileController::class, 'show']);
    Route::post('profile', [PlayerProfileController::class, 'store']);
    Route::apiResource('player-stats', PlayerStatController::class);

    Route::post('/player-ads', [PlayerAdController::class, 'store']);
    Route::delete('/player-ads/{playerAd}', [PlayerAdController::class, 'destroy']);

    Route::post('applications', [VacancyApplicationController::class, 'store']);
    Route::patch('applications/{application}', [VacancyApplicationController::class, 'updateStatus']);
});
