<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VacancyApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'vacancy_id',
        'user_id',
        'status',
        'message'
    ];

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class)->with('profile');
    }
}
