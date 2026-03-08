<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVacancyRequest extends FormRequest
{
    public function rules()
    {
        return [
            'team_id' => 'required|exists:teams,id',
            'game_igdb_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'role_needed' => 'required|string|max:100',
        ];
    }
}
