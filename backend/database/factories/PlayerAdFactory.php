<?php

namespace Database\Factories;

use App\Models\PlayerAd;
use App\Models\User;
use App\Models\PlayerStat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlayerAd>
 */
class PlayerAdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'player_stat_id' => function (array $attributes) {
                return PlayerStat::factory()->create(['user_id' => $attributes['user_id']])->id;
            },
            'message' => $this->faker->sentence(),
        ];
    }
}
