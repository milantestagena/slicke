<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use App\Enums\CollectionType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Collection>
 */
class CollectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'type' => CollectionType::Stickers,
            'name' => Str::random(64),
            'description' => Str::random(1028),
            'link' => Str::random(128),
            'year' => 2023,
        ];
    }
}
