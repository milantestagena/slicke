<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\UserCollection;
use App\Models\UserItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

        foreach(UserCollection::all() as $userCollection){
            foreach(Item::where('collection_id', $userCollection->collection_id)->get() as $item){
                UserItem::factory()->create([
                    'user_collection_id' => $userCollection->id,
                    'item_id' => $item->id
                ]);
            }
        }
    }
}
