<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have some teams with vacancies
        $teams = \App\Models\Team::all();

        if ($teams->count() < 5) {
            // Create more teams if needed
            $teams = \App\Models\Team::factory(5)->create();
        }

        foreach ($teams as $team) {
            // Each team has 1-3 vacancies
            \App\Models\Vacancy::factory(rand(1, 3))->create([
                'team_id' => $team->id
            ]);
        }
    }
}
