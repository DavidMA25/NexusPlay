<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlayerProfileRequest extends FormRequest
{
    public function rules()
    {
        return [
            'availability_status' => 'required|string|max:50',
            'languages' => 'required|string|max:255',
            'region' => 'required|string|max:100',
        ];
    }
}
