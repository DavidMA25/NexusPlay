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
        // Ensure test user exists with profile
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        PlayerProfile::factory()->create(['user_id' => $testUser->id]);
        PlayerStat::factory(2)->create(['user_id' => $testUser->id]);

        // Generate 25 complete profiles
        User::factory(25)->create()->each(function ($user) {
            PlayerProfile::factory()->create(['user_id' => $user->id]);
            
            $numGames = rand(1, 3);
            PlayerStat::factory($numGames)->create(['user_id' => $user->id]);
        });
    }
}
