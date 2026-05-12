<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TryoutParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'wp_post_id',
        'user_id',
        'status',
    ];

    protected $casts = [
        'wp_post_id' => 'integer',
        'user_id'    => 'integer',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
