<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CollectionCountriesPublic extends JsonResource
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
        foreach($this as $data){
            foreach($data as $model){
                $ret[] = (object)[
                    "id"=> $model->id,
                    "country"=> $model->country,
                    "region"=> $model->region,
                ];
            }
        }
        return $ret;
    }
}
