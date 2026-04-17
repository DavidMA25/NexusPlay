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
            'description' => $this->description,
            'game_igdb_id' => $this->game_igdb_id, // we might need 'game_name' but frontend can map it
            'role_needed' => $this->role_needed,
            'rank_min' => $this->required_rank_min,
            'rank_max' => $this->required_rank_max,
            'status' => $this->status,
            'created_at' => $this->created_at ? $this->created_at->diffForHumans() : '2h ago',
            'team' => [
                'id' => $this->team->id,
                'name' => $this->team->name,
                'logo_url' => $this->team->logo_url,
                'region' => $this->team->region ?? 'Europe West',
                'language' => 'English',
                'member_count' => $this->team->members()->count(),
                'max_members' => 5 // Default for now
            ]
        ];
    }
}
