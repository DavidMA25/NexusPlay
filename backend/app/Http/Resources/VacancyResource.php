<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VacancyResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'team' => $this->team->name,
            'game_igdb_id' => $this->game_igdb_id,
            'role_needed' => $this->role_needed,
            'rank_min' => $this->required_rank_min,
            'rank_max' => $this->required_rank_max,
            'status' => $this->status,
        ];
    }
}
