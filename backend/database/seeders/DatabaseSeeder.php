<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PlayerProfile;
use App\Models\PlayerStat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure test user exists with profile and ads
        $testUser = User::updateOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        if (!$testUser->profile) {
            PlayerProfile::factory()->create(['user_id' => $testUser->id]);
        }

        if ($testUser->stats()->count() == 0) {
            PlayerStat::factory(2)->create(['user_id' => $testUser->id]);
        }

        // Create a PlayerAd for the test user
        if (\App\Models\PlayerAd::where('user_id', $testUser->id)->count() == 0) {
            $testUser->refresh(); // Refresh to load stats
            \App\Models\PlayerAd::factory()->create([
                'user_id' => $testUser->id,
                'player_stat_id' => $testUser->stats->first()->id,
                'message' => 'LFG! Looking for a competitive team.'
            ]);
        }

        // Generate 30 more complete profiles with ads
        User::factory(30)->create()->each(function ($user) {
            PlayerProfile::factory()->create(['user_id' => $user->id]);
            
            $numGames = rand(1, 4);
            $stats = PlayerStat::factory($numGames)->create(['user_id' => $user->id]);

            // 70% chance to have a PlayerAd
            if (rand(1, 100) <= 70) {
                \App\Models\PlayerAd::factory()->create([
                    'user_id' => $user->id,
                    'player_stat_id' => $stats->random()->id
                ]);
            }
        });

        // Seed teams and vacancies
        $this->call(VacancySeeder::class);
    }
}
