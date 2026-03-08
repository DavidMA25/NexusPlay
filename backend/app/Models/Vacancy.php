<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'game_igdb_id',
        'title',
        'description',
        'required_rank_min',
        'required_rank_max',
        'role_needed',
        'status'
    ];

    protected $casts = [
        'game_igdb_id' => 'integer'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function applications()
    {
        return $this->hasMany(VacancyApplication::class);
    }
}
