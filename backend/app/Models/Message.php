<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'deleted_at',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    // Relationship: Links to the specific user author of this message content
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // Computed attribute replacement enabling standard UI handling for deleted texts
    public function getDisplayContentAttribute(): string
    {
        return $this->deleted_at ? '[Message deleted]' : $this->content;
    }
}
