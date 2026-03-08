<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeamMember extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'team_id',
        'user_id',
        'role_in_team',
        'joined_at'
    ];
}
