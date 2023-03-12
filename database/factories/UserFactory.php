<?php

namespace Database\Factories;

use App\Models\Countries;
use App\Models\Membership;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => fake()->bothify(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'fullname' => fake()->name(),
            'mailing_address_street' => fake()->streetAddress(),
            'mailing_address_number' => fake()->numerify(),
            'mailing_address_postal' => fake()->numerify(),
            'latitute' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'country_id' => 185,
            'membership_id' => $this->faker->randomElement(Membership::pluck('id')),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
