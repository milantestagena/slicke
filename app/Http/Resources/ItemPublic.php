<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ItemPublic extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $ret = (object)[
            "id"=> $this->id,
            "identifier"=> $this->identifier,
            "description"=> $this->description,
            "link"=> $this->link,
            "title"=> $this->title
        ];
         
    
        return $ret;
    }
}
