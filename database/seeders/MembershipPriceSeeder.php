<?php

namespace Database\Seeders;

use App\Models\MembershipPrice;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MembershipPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        MembershipPrice::factory()->create([
            'membership_id' => 2,
            'amount' => 100
        ]);
        MembershipPrice::factory()->create([
            'membership_id' => 3,
            'amount' => 1000
        ]);
        MembershipPrice::factory()->create([
            'membership_id' => 4,
            'amount' => 10000
        ]);
    }
}
