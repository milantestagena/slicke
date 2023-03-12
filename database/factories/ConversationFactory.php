<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $senderId = $this->faker->randomElement(User::pluck('id'));
        $receiverId = $this->faker->randomElement(User::where('id', '!=' , $senderId)->pluck('id'));
        return [
            //
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'message' => Str::random(1024),
        ];
    }
}
