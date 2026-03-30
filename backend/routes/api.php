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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/user/settings', [AuthController::class, 'updateSettings']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('teams', TeamController::class);
    Route::apiResource('vacancies', VacancyController::class);

    Route::get('profile', [PlayerProfileController::class, 'show']);
    Route::post('profile', [PlayerProfileController::class, 'store']);
    Route::apiResource('player-stats', PlayerStatController::class);

    Route::post('/player-ads', [PlayerAdController::class, 'store']);
    Route::delete('/player-ads/{playerAd}', [PlayerAdController::class, 'destroy']);

    Route::post(
        'applications',
        [VacancyApplicationController::class, 'store']
    );
    Route::patch(
        'applications/{application}',
        [VacancyApplicationController::class, 'updateStatus']
    );
});

