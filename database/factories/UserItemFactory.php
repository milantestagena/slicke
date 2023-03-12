<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\UserCollection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserItem>
 */
class UserItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $userCollectionId = $this->faker->randomElement(UserCollection::pluck('id'));
        $itemId = $this->faker->randomElement(Item::pluck('id'));
        return [
            //
            'user_collection_id' => $userCollectionId,
            'item_id' => $itemId,
            'counter' => rand(0,3)
        ];
    }
}
