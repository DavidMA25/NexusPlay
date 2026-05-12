<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_group',
        'group_name',
        'owner_id',
    ];

    protected $casts = [
        'is_group' => 'boolean',
    ];

    // Relationship: Multi-user association of who belongs in this conversation
    public function participants()
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    // Relationship: Retrieves full list of standard message objects in ordering sequence
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // Short helper relationship fetching the absolute newest single message item
    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
