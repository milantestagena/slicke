<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MembershipPricePerCountry>
 */
class MembershipPriceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $country_id = 185;
        $membershipId = 1;
        return [
            //
            'country_id' => $country_id,
            'membership_id' => $membershipId,
            'amount' => 100,
            'currency_international' => 'RSD',
            'currency' => "Dinar",
        ];
    }
}
