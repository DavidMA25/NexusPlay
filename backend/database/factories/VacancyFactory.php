<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vacancy>
 */
class VacancyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'game_igdb_id' => $this->faker->randomElement([1, 2, 3, 4, 5, 6, 7]),
            'title' => $this->faker->sentence(4),
            'description' => "Looking for a " . $this->faker->randomElement(['Diamond', 'Platinum', 'Gold', 'ascendant']) . "+ " . $this->faker->randomElement(['Support', 'Duelist', 'Smokes', 'Sentinel']) . " main for weekly tournament brackets. We prioritize communication and consistency over raw mechanics.",
            'required_rank_min' => $this->faker->randomElement(['Gold 1', 'Platinum 2', 'Diamond 1']),
            'required_rank_max' => $this->faker->randomElement(['Diamond 3', 'Ascendant 1', 'Immortal 1']),
            'role_needed' => $this->faker->randomElement(['Support', 'Top', 'Mid', 'Jungle', 'Duelist', 'Smokes']),
            'status' => 'open',
            'created_at' => $this->faker->dateTimeBetween('-1 day', 'now'),
            'updated_at' => now(),
        ];
    }
}
