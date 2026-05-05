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
            ['name' => 'Test User', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );

        $testUser2 = User::updateOrCreate(
            ['email' => 'test2@example.com'],
            ['name' => 'Test User 2', 'nickname' => 'tester2', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );

        $testUser3 = User::updateOrCreate(
            ['email' => 'test3@example.com'],
            ['name' => 'Test User 3', 'nickname' => 'tester3', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );

        foreach ([$testUser, $testUser2, $testUser3] as $user) {
            if (!$user->profile) {
                PlayerProfile::factory()->create([
                    'user_id' => $user->id,
                    'region' => 'Europe',
                    'languages' => 'Spanish'
                ]);
            } else {
                $user->profile->update([
                    'region' => 'Europe',
                    'languages' => 'Spanish'
                ]);
            }

            if ($user->stats()->count() == 0) {
                PlayerStat::factory()->create([
                    'user_id' => $user->id,
                    'game_igdb_id' => 1372, // CS:GO
                    'game_name' => 'Counter-Strike: Global Offensive',
                    'region' => 'Europe'
                ]);
            } else {
                $user->stats->first()->update([
                    'game_igdb_id' => 1372,
                    'game_name' => 'Counter-Strike: Global Offensive',
                    'region' => 'Europe'
                ]);
            }
        }

        // --- TEST SCENARIO FOR "Ads You Might Like" ---
        // 1. Ad user that perfectly matches (Game, Region, Language)
        $perfectMatchUser = User::factory()->create(['name' => 'Perfect Match', 'email_verified_at' => now()]);
        PlayerProfile::factory()->create(['user_id' => $perfectMatchUser->id, 'region' => 'Europe', 'languages' => 'Spanish']);
        $perfectStat = PlayerStat::factory()->create(['user_id' => $perfectMatchUser->id, 'game_igdb_id' => 1372, 'game_name' => 'Counter-Strike: Global Offensive', 'region' => 'Europe']);
        \App\Models\PlayerAd::factory()->create(['user_id' => $perfectMatchUser->id, 'player_stat_id' => $perfectStat->id, 'message' => 'Perfect Match Ad (ESP/EUR/CSGO)']);

        // 2. Ad user that matches Region and Game, but NOT Language (Secondary priority)
        $regionMatchUser = User::factory()->create(['name' => 'Region Match', 'email_verified_at' => now()]);
        PlayerProfile::factory()->create(['user_id' => $regionMatchUser->id, 'region' => 'Europe', 'languages' => 'English']);
        $regionStat = PlayerStat::factory()->create(['user_id' => $regionMatchUser->id, 'game_igdb_id' => 1372, 'game_name' => 'Counter-Strike: Global Offensive', 'region' => 'Europe']);
        \App\Models\PlayerAd::factory()->create(['user_id' => $regionMatchUser->id, 'player_stat_id' => $regionStat->id, 'message' => 'Region Match Ad (ENG/EUR/CSGO)']);

        // 3. Another Ad user that perfectly matches to fill the 3 slots
        $perfectMatchUser2 = User::factory()->create(['name' => 'Perfect Match 2', 'email_verified_at' => now()]);
        PlayerProfile::factory()->create(['user_id' => $perfectMatchUser2->id, 'region' => 'Europe', 'languages' => 'Spanish']);
        $perfectStat2 = PlayerStat::factory()->create(['user_id' => $perfectMatchUser2->id, 'game_igdb_id' => 1372, 'game_name' => 'Counter-Strike: Global Offensive', 'region' => 'Europe']);
        \App\Models\PlayerAd::factory()->create(['user_id' => $perfectMatchUser2->id, 'player_stat_id' => $perfectStat2->id, 'message' => 'Another Perfect Match Ad (ESP/EUR/CSGO)']);

        // 4. Ad user that matches Game but NOT Region (Should NOT show up)
        $wrongRegionUser = User::factory()->create(['name' => 'Wrong Region', 'email_verified_at' => now()]);
        PlayerProfile::factory()->create(['user_id' => $wrongRegionUser->id, 'region' => 'Asia', 'languages' => 'Spanish']);
        $wrongRegionStat = PlayerStat::factory()->create(['user_id' => $wrongRegionUser->id, 'game_igdb_id' => 1372, 'game_name' => 'Counter-Strike: Global Offensive', 'region' => 'Asia']);
        \App\Models\PlayerAd::factory()->create(['user_id' => $wrongRegionUser->id, 'player_stat_id' => $wrongRegionStat->id, 'message' => 'Wrong Region Ad (Asia) - Should not see this!']);
        // ----------------------------------------------

        // Generate 30 more complete profiles with ads
        User::factory(30)->create(['email_verified_at' => now()])->each(function ($user) {
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
        // $this->call(VacancySeeder::class);
    }
}
