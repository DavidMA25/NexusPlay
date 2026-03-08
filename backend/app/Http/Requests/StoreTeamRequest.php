<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeamRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'region' => 'required|string',
            'description' => 'nullable|string',
            'website' => 'nullable|url'
        ];
    }
}
