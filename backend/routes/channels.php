<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return \App\Models\Conversation::where('id', $conversationId)
        ->whereHas('participants', fn($q) => $q->where('user_id', $user->id))
        ->exists();
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
