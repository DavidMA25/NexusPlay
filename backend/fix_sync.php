<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$teams = App\Models\Team::with('members')->get();
foreach ($teams as $team) {
    $conversation = App\Models\Conversation::where('is_group', true)
        ->where(function($q) use ($team) { 
            $q->where('group_name', $team->name)->orWhere('group_name', 'Team ' . $team->name); 
        })
        ->where('owner_id', $team->owner_id)
        ->first();
        
    if ($conversation) {
        foreach ($team->members as $member) {
            if (!$conversation->participants()->where('user_id', $member->id)->exists()) {
                $conversation->participants()->attach($member->id);
                echo "Attached user {$member->id} to conversation {$conversation->id}\n";
            }
        }
    }
}
echo "Done.\n";
