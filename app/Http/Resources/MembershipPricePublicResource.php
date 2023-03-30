<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MembershipPricePublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $prices = [];
        foreach($this as $collection){
            foreach($collection as $object){
                $prices[] = (object) [
                    'package_id' => $object->membership->id,
                    'package' => $object->membership->name, 
                    'amount' => $object->amount,
                    'currency_international' => $object->currency_international,
                    'currency' => $object->currency,
                ];
            }
        }
        return $prices;
    }
}
