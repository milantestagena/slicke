<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserItemsPublic extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $ret = [];
        foreach($this as  $model){
            foreach($model as $item){
                $ret[] = (object)[
                    "id"=> $item->id,
                    "item"=> new ItemPublic($item->item),
                    "counter"=> $item->counter,
                ];
            }
        }
        return $ret;
    }
}
