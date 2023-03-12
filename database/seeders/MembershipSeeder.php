<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Membership;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MembershipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Membership::factory()->create([
             'name' => 'Bronze',
             'description' => fake()->text(),
         ]);
         Membership::factory()->create([
            'name' => 'Silver',
            'description' => fake()->text(),
        ]);
        Membership::factory()->create([
            'name' => 'Gold',
            'description' => fake()->text(),
        ]);
        Membership::factory()->create([
            'name' => 'Diamond',
            'description' => fake()->text(),
        ]);
    }
}
