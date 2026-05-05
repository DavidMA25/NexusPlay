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
    TryoutController,
    IGDBController,
    ConversationController
};

// ─────────────────────────────────────────────────────────────────────────────
// RUTAS PÚBLICAS
// ─────────────────────────────────────────────────────────────────────────────

Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/players',    [PlayerController::class, 'index']);
Route::get('/players/{id}', [PlayerController::class, 'show']);
Route::get('/player-ads', [PlayerAdController::class, 'index']);
Route::get('/vacancies',  [VacancyController::class, 'index']);

// Participantes del tryout — público para que WordPress los pueda leer
Route::get('/tryouts/{wpPostId}/participants', [TryoutController::class, 'participants'])
    ->where('wpPostId', '[0-9]+');

// ─────────────────────────────────────────────────────────────────────────────
// RUTAS PROTEGIDAS
// ─────────────────────────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Autenticación de canales privados de Reverb (debe ir dentro del grupo auth)
    Route::post('/broadcasting/auth', function (\Illuminate\Http\Request $request) {
        return \Illuminate\Support\Facades\Broadcast::auth($request);
    });

    // Sesión y verificación
    Route::get('/user',           [AuthController::class, 'user']);
    Route::post('/logout',        [AuthController::class, 'logout']);
    Route::post('/user/settings', [AuthController::class, 'updateSettings']);

    Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
        $user = \App\Models\User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link.'], 403);
        }
        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'The link has expired or is invalid.'], 403);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'The email was already verified.']);
        }

        $user->markEmailAsVerified();
        return response()->json(['message' => 'Email successfully verified.']);
    })->name('verification.verify');

    Route::post('/email/resend', [AuthController::class, 'resendVerification']);

    // IGDB
    Route::get('/igdb/search', [IGDBController::class, 'search']);

    // Equipos
    Route::get('/teams/my', [TeamController::class, 'myTeams']);
    Route::apiResource('teams', TeamController::class);
    Route::post('/teams/{team}/members', [TeamController::class, 'addMember']);
    Route::delete('/teams/{team}/members/{user}', [TeamController::class, 'removeMember']);

    // Notificaciones
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllRead']);
    Route::get('/notifications/unread-count', [\App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{notification}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markRead']);

    // Vacantes
    Route::post('/vacancies',             [VacancyController::class, 'store']);
    Route::get('/vacancies/{vacancy}',    [VacancyController::class, 'show']);
    Route::put('/vacancies/{vacancy}',    [VacancyController::class, 'update']);
    Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy']);

    // Perfil y estadísticas del jugador
    Route::get('profile',  [PlayerProfileController::class, 'show']);
    Route::post('profile', [PlayerProfileController::class, 'store']);
    Route::apiResource('player-stats', PlayerStatController::class);

    // Anuncios de jugador
    Route::post('/player-ads',              [PlayerAdController::class, 'store']);
    Route::delete('/player-ads/{playerAd}', [PlayerAdController::class, 'destroy']);

    // Aplicaciones a vacantes
    Route::post('applications',                 [VacancyApplicationController::class, 'store']);
    Route::patch('applications/{application}',  [VacancyApplicationController::class, 'updateStatus']);

    // Tryouts
    Route::get('/tryouts/my-participations',   [TryoutController::class, 'myParticipations']);
    Route::post('/tryouts/{wpPostId}/join',    [TryoutController::class, 'join'])
        ->where('wpPostId', '[0-9]+');
    Route::delete('/tryouts/{wpPostId}/leave', [TryoutController::class, 'leave'])
        ->where('wpPostId', '[0-9]+');
    Route::get('/tryouts/{wpPostId}/my-status', [TryoutController::class, 'myStatus'])
        ->where('wpPostId', '[0-9]+');
    Route::patch('/tryouts/{wpPostId}/participants/{participantId}', [TryoutController::class, 'updateStatus'])
        ->where(['wpPostId' => '[0-9]+', 'participantId' => '[0-9]+']);

    // ─────────────────────────────────────────────────────────────────────────
    // CHAT
    // ─────────────────────────────────────────────────────────────────────────

    Route::get('/conversations',                                                    [ConversationController::class, 'index']);
    Route::post('/conversations/direct',                                            [ConversationController::class, 'findOrCreateDirect']);
    Route::post('/conversations/group',                                             [ConversationController::class, 'createGroup']);
    Route::get('/conversations/{conversation}/messages',                            [ConversationController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages',                           [ConversationController::class, 'sendMessage']);
    Route::delete('/conversations/{conversation}/messages/{message}',               [ConversationController::class, 'deleteMessage']);
    Route::post('/conversations/{conversation}/read',                               [ConversationController::class, 'markRead']);
    Route::post('/conversations/{conversation}/leave',                              [ConversationController::class, 'leaveGroup']);
});
