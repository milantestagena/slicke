<?php

namespace App\Http\Resources;

use App\Http\Resources\CollectionItemsPublic;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CollectionCountriesPublic;

class CollectionPublic extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $response = (object)[
            "id"=> $this->id,
            "type"=> $this->type,
            "name"=> $this->name,
            "description"=> $this->description,
            "link"=> $this->link,
            "year"=> $this->year,
        ];

        return $response;
    }
}
