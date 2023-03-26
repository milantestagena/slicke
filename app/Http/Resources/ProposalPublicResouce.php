<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProposalPublicResouce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $items = [];
        foreach($this->items as $item){
            $items[] = (object)[
                "id"=> $item->id,
                "user_id" => $item->user_id, 
                "user_item"=> (object)[
                    'id' => $item->item->id,
                    'identifier' => $item->item->item->identifier,
                    'counter' => $item->item->counter
                ],
            ];
        }

        $ret = (object)[
            'sender' => new UserShortPublicResource($this->sender),
            'receiver' => new UserShortPublicResource($this->receiver),
            'items' => $items
        ];
        return $ret;
    }
}
