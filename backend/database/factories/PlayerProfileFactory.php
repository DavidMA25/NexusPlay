<?php

namespace Database\Factories;

use App\Models\PlayerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlayerProfile>
 */
class PlayerProfileFactory extends Factory
{
    protected $model = PlayerProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['Looking for Team', 'Playing Casually', 'Competitive', 'Taking a Break', 'LFG Ranked'];
        $regions = ['Europe', 'North America', 'South America', 'Asia', 'Oceania'];
        $languagesOptions = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese'];
        
        // Randomly pick 1 to 3 languages
        $numLanguages = fake()->numberBetween(1, 3);
        $selectedLanguages = fake()->randomElements($languagesOptions, $numLanguages);
        
        return [
            'user_id' => User::factory(),
            'availability_status' => fake()->randomElement($statuses),
            'languages' => implode(', ', $selectedLanguages),
            'region' => fake()->randomElement($regions),
        ];
    }
}
