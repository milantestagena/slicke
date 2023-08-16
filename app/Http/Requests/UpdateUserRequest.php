<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['string'],
            'password' => [
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->symbols()
                    ->numbers()
            ],
            'country_id' => ['exists:countries,id'],
            'membership_id' => ['exists:memberships,id'],
            'phone_number' => ['string'],
            'fullname' => ['string'],
            'mailing_address_street' => ['string'],
            'mailing_address_number' => ['string'],
            'mailing_address_postal' => ['string'],
        ];
    }
}
