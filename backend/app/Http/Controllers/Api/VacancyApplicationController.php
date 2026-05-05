<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VacancyApplication;
use Illuminate\Http\Request;

class VacancyApplicationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'vacancy_id' => 'required|exists:vacancies,id',
            'message' => 'nullable|string'
        ]);

        $data['user_id'] = auth()->id();

        $application = VacancyApplication::create($data);
        
        $vacancy = \App\Models\Vacancy::with('team')->find($data['vacancy_id']);
        
        // Notify team owner
        \App\Models\Notification::createAndBroadcast([
            'user_id' => $vacancy->team->owner_id,
            'type' => 'team_application',
            'data' => [
                'application_id' => $application->id,
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->nickname ?? auth()->user()->name,
                'avatar_url' => auth()->user()->avatar_url,
                'message' => $data['message'],
                'team_name' => $vacancy->team->name
            ]
        ]);

        return $application;
    }

    public function updateStatus(Request $request, VacancyApplication $application)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);

        $vacancy = \App\Models\Vacancy::with('team')->find($application->vacancy_id);
        
        if (auth()->id() !== $vacancy->team->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        $application->update([
            'status' => $request->status
        ]);

        if ($request->status === 'accepted') {
            // Add user to team
            if (!$vacancy->team->members()->where('user_id', $application->user_id)->exists()) {
                $vacancy->team->members()->attach($application->user_id, [
                    'role_in_team' => 'member',
                    'joined_at' => now()
                ]);
            }

            // Add user to team conversation
            $conversation = \App\Models\Conversation::where('is_group', true)
                ->where('group_name', $vacancy->team->name)
                ->where('owner_id', $vacancy->team->owner_id)
                ->first();

            if ($conversation && !$conversation->participants()->where('user_id', $application->user_id)->exists()) {
                $conversation->participants()->attach($application->user_id);
            }
            
            \App\Models\Notification::createAndBroadcast([
                'user_id' => $application->user_id,
                'type' => 'application_accepted',
                'data' => [
                    'team_name' => $vacancy->team->name,
                    'message' => "You have been accepted into " . $vacancy->team->name
                ]
            ]);
        } else {
            \App\Models\Notification::createAndBroadcast([
                'user_id' => $application->user_id,
                'type' => 'application_rejected',
                'data' => [
                    'team_name' => $vacancy->team->name,
                    'message' => "Your application for " . $vacancy->team->name . " has been declined"
                ]
            ]);

            $application->delete();
        }

        return response()->json(['message' => 'Status updated', 'status' => $request->status]);
    }
}
