<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVacancyRequest extends FormRequest
{
    public function rules()
    {
        return [
            'team_id' => 'required|exists:teams,id',
            'game_igdb_id' => 'nullable|integer',
            'title' => 'nullable|string|max:255',
            'description' => 'required|string',
            'role_needed' => 'nullable|string|max:100',
            'required_rank_min' => 'nullable|string',
            'required_rank_max' => 'nullable|string',
        ];
    }
}
