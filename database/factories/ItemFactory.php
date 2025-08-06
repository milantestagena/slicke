<?php

namespace Database\Factories;

use App\Models\Collection;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    protected static int $counter = 1;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            //
            'collection_id' => 2,
            'identifier' => str_pad(self::$counter++, 3, '0', STR_PAD_LEFT),
            'description' => $this->faker->sentence(8),
            'link' => 'https://via.placeholder.com/150x200?text=' . $this->faker->unique()->numberBetween(100, 999),
            'title' => $this->faker->words(2, true),
        ];
    }
}
