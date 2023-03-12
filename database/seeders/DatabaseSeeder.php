<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Item;
use App\Models\User;
use App\Models\Collection;
use Illuminate\Database\Seeder;
use Database\Seeders\ItemSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\UserItemSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\MembershipSeeder;
use Database\Seeders\ConversationSeeder;
use Database\Seeders\UserCollectionSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
         //\App\Models\User::factory(30)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            MembershipSeeder::class,
            UserSeeder::class,
            ConversationSeeder::class,
            CollectionSeeder::class,
            ItemSeeder::class,
            UserCollectionSeeder::class,
            UserItemSeeder::class,
        ]);
    }
}
