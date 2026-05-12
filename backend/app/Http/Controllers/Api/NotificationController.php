<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Lists all notifications for the authenticated user paginated
    public function index()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->latest()
            ->paginate(20);
            
        return \App\Http\Resources\NotificationResource::collection($notifications);
    }

    // Sets a specific notification read_at timestamp to now
    public function markRead(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->update(['read_at' => now()]);
        return response()->json(['message' => 'Marked as read']);
    }

    // Sets all unread notifications of the user as read
    public function markAllRead()
    {
        Notification::where('user_id', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All marked as read']);
    }

    // Counts total number of unread notifications for simple badge displays
    public function unreadCount()
    {
        $count = Notification::where('user_id', auth()->id())
            ->whereNull('read_at')
            ->count();
            
        return response()->json(['count' => $count]);
    }
}
