<?php

namespace Database\Factories;

use App\Models\PlayerStat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlayerStat>
 */
class PlayerStatFactory extends Factory
{
    protected $model = PlayerStat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Popular games IGDB IDs (e.g. 115 = League of Legends, 131800 = Valorant, 1372 = CS:GO, 114795 = Apex Legends)
        $popularGames = [115, 131800, 1372, 125174, 114795, 2909, 1074];
        $tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger', 'Unranked'];
        $regions = ['Europe', 'North America', 'South America', 'Asia', 'Oceania'];
        $roles = ['Tank', 'Healer', 'Damage', 'Support', 'Flex', 'Entry Fragger', 'IGL', 'Sniper', 'Assassin'];
        
        return [
            'user_id' => User::factory(),
            'game_igdb_id' => fake()->randomElement($popularGames),
            'rank_tier' => fake()->randomElement($tiers),
            'region' => fake()->randomElement($regions),
            'role_main' => fake()->randomElement($roles),
        ];
    }
}
