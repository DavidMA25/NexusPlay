<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'region' => $this->region,
            'description' => $this->description,
            'owner' => $this->owner->nickname,
            'members' => $this->members->count(),
        ];
    }
}
