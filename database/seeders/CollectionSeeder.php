<?php

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Support\Str;
use App\Enums\CollectionType;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Collection::factory()->create([
            'type' => CollectionType::Stickers,
            'name' => 'EURO 2024',
            'description' => Str::random(1024),
            'link' => 'www.euro2024',
            'year' => 2023,
        ]);
    }
}
