<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'data',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Create and broadcast a notification.
     */
    public static function createAndBroadcast(array $attributes)
    {
        $notification = self::create($attributes);
        broadcast(new \App\Events\NotificationSent($notification));
        return $notification;
    }
}
