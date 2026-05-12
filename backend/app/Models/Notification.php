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
        $user = User::find($attributes['user_id']);
        if ($user) {
            $prefs = $user->notification_preferences ?? ['teamInvites' => true, 'messages' => true];
            
            $type = $attributes['type'];
            
            if ($type === 'new_message' && !($prefs['messages'] ?? true)) {
                return null;
            }
            
            if (in_array($type, ['team_application', 'application_accepted', 'application_rejected']) && !($prefs['teamInvites'] ?? true)) {
                return null;
            }
        }

        $notification = self::create($attributes);
        broadcast(new \App\Events\NotificationSent($notification));
        return $notification;
    }
}
