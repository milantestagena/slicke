<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CountryPublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $formated = [];
        foreach($this as $collection){
            foreach($collection as $country){
                $formated[] = (object)[
                    'id' => $country->id,
                    'country' => $country->country,
                    'region' => $country->region,
                    'active' => (bool)$country->active
                ];
            }
        }
        return $formated;
    }
}
