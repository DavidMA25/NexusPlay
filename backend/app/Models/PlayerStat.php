<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlayerStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'game_igdb_id',
        'rank_tier',
        'region',
        'role_main'
    ];

    protected $casts = [
        'game_igdb_id' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
