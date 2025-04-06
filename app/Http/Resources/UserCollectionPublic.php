<?php
namespace App\Http\Resources;

use Illuminate\Support\Collection;
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

        if ($this->resource instanceof Collection) {
            foreach($this->resource as $item){
                $response[] = $this->formatResponse($item);
            }

        } else {
            $response = $this->formatResponse($this->resource);
        }


        return $response;
    }

    private function formatResponse($data){
        $response = (object)[
            "id"=> $data->id,
            "collection"=> new CollectionPublic($data->collection),
            "items" => new UserItemsPublic($data->items)
        ];

        return $response;
    }
}
