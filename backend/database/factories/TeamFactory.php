<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'owner_id' => User::factory(),
            'name' => $this->faker->company() . ' Esports',
            'logo_url' => 'https://api.dicebear.com/7.x/identicon/svg?seed=' . urlencode($this->faker->word()),
            'description' => $this->faker->paragraph(),
            'region' => $this->faker->randomElement(['Europe West', 'Europe Nordic & East', 'North America', 'South America', 'Korea']),
            'website' => $this->faker->optional()->url(),
        ];
    }
}
