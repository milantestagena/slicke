<?php

namespace App\Http\Resources;

use App\Http\Resources\CollectionPublic;
use Illuminate\Http\Resources\Json\JsonResource;

class UserCollectionPublic extends JsonResource
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
            "collection"=> new CollectionPublic($this->collection),
            "items" => new UserItemsPublic($this->items)
        ];
        return $response;
    }
}
