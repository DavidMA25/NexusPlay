<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

use App\Http\Controllers\Api\{
    TeamController,
    VacancyController,
    PlayerStatController,
    PlayerProfileController,
    VacancyApplicationController
};

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('teams', TeamController::class);
    Route::apiResource('vacancies', VacancyController::class);

    Route::get('profile', [PlayerProfileController::class, 'show']);
    Route::post('profile', [PlayerProfileController::class, 'store']);
    Route::apiResource('player-stats', PlayerStatController::class);

    Route::post(
        'applications',
        [VacancyApplicationController::class, 'store']
    );
    Route::patch(
        'applications/{application}',
        [VacancyApplicationController::class, 'updateStatus']
    );
});
