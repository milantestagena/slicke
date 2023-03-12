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
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $collectionId = Collection::first()->id;
        return [
            //
            'collection_id' => $collectionId,
            'identifier' => fake()->numerify(),
            'description' => Str::random(256),
            'link' => Str::random(128),
            'title' => Str::random(64),
        ];
    }
}
