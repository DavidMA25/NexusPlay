<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerProfileResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'user_id' => $this->user_id,
            'availability_status' => $this->availability_status,
            'languages' => $this->languages,
            'region' => $this->region,
        ];
    }
}
