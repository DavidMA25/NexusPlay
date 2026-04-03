<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        $nickname = fake()->unique()->userName();
        
        return [
            'name' => $name,
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'nickname' => $nickname,
            'role' => 'player',
            'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=' . urlencode($nickname),
            'bio' => fake()->realText(150),
            'remember_token' => Str::random(10),
        ];
    }
}
