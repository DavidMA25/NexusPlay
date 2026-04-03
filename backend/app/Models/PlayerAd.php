<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlayerAd extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'player_stat_id',
        'message',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stat()
    {
        return $this->belongsTo(PlayerStat::class, 'player_stat_id');
    }
}
