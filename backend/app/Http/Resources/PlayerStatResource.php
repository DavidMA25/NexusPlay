<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerStatResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'game_igdb_id' => $this->game_igdb_id,
            'game_name' => $this->game_name,
            'rank_tier' => $this->rank_tier,
            'region' => $this->region,
            'role_main' => $this->role_main,
            'platform' => $this->platform,
        ];
    }
}
