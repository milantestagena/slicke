<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApiProposalRequest extends FormRequest
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
            'receiver_id' => 'required|integer|exists:users,id',
            'collection_id' => 'required|integer|exists:collections,id',
            'need' => 'required|array',
            'need.*' => 'exists:user_items,item_id',
            'offer' => 'required|array',
            'offer.*' => 'exists:user_items,item_id'
        ];
    }
}
