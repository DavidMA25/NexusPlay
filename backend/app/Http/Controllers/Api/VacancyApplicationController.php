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

        return VacancyApplication::create($data);
    }

    public function updateStatus(Request $request, VacancyApplication $application)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);

        $application->update([
            'status' => $request->status
        ]);

        return $application;
    }
}
