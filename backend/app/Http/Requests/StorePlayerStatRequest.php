<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlayerStatRequest extends FormRequest
{
    public function rules()
    {
        return [
            'game_igdb_id' => 'required|integer',
            'rank_tier' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'role_main' => 'required|string|max:100',
            'platform' => 'required|string|in:PlayStation,Mobile,Nintendo,Xbox,PC',
        ];
    }
}
