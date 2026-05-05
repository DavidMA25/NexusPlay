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
            'logo_url' => $this->logo_url,
            'language' => $this->language,
            'game_igdb_id' => $this->game_igdb_id,
            'platform' => $this->platform,
            'owner_id' => $this->owner_id,
            'owner_name' => $this->owner->nickname ?? $this->owner->name,
            'is_admin' => auth()->id() === $this->owner_id,
            'member_count' => $this->members()->count(),
            'members' => $this->whenLoaded('members')
        ];
    }
}
