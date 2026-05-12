<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'nickname',
        'role',
        'avatar_url',
        'bio',
        'notification_preferences'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'notification_preferences' => 'array',
        ];
    }

    // Relationship: A user has one player profile
    public function profile()
    {
        return $this->hasOne(PlayerProfile::class);
    }

    // Relationship: A user has many player statistics records
    public function stats()
    {
        return $this->hasMany(PlayerStat::class);
    }

    // Relationship: A user belongs to many teams
    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_members');
    }

    // Relationship: A user has many player ads
    public function ads()
    {
        return $this->hasMany(PlayerAd::class);
    }

    // Relationship: A user participates in many conversations
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }
}
