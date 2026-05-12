<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'logo_url',
        'description',
        'region',
        'website',
        'language',
        'game_igdb_id',
        'platform',
        'conversation_id',
    ];

    // Relationship: The specific privileged user controlling management of this team object
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Relationship: Published job opening listings from this team looking for members
    public function vacancies()
    {
        return $this->hasMany(Vacancy::class);
    }

    // Relationship: Many-to-many collection lookup associating accepted members to team
    public function members()
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withPivot('role_in_team', 'joined_at');
    }
}
