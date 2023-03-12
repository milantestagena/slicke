<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\User;
use App\Models\UserCollection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $collectionId = Collection::first()->id;
        foreach(User::pluck('id') as $userId){
            UserCollection::factory()->create([
                'user_id' => $userId,
                'collection_id' => $collectionId
            ]);
        }
        //
    }
}
