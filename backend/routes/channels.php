<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

// Canal por conversación — solo participantes
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return \App\Models\Conversation::where('id', $conversationId)
        ->whereHas('participants', fn($q) => $q->where('user_id', $user->id))
        ->exists();
});

// Canal personal de usuario — solo el propio usuario
// El frontend lo escucha desde el login para recibir mensajes nuevos
// aunque el chat no esté abierto o la conversación sea desconocida
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
