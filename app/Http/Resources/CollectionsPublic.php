<?php

namespace App\Http\Resources;

use App\Http\Resources\CollestionItemsPublic;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionsPublic extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $response = [];
        foreach($this as $data){
            foreach($data as $model){
                $response[] = (object)[
                    "id"=> $model->id,
                    "type"=> $model->type,
                    "name"=> $model->name,
                    "description"=> $model->description,
                    "link"=> $model->link,
                    "year"=> $model->year,
                    "items"=> new CollestionItemsPublic($model->items)
                ];
            }
        }
        return $response;
    }
}
