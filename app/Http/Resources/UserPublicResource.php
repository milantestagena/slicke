<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserPublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "email" => $this->email,
            "phone_number" => $this->phone_number,
            "fullname" => $this->fullname,
            "mailing_address_street" => $this->mailing_address_street,
            "mailing_address_number" => $this->mailing_address_number,
            "mailing_address_postal" => $this->mailing_address_postal,
            "latitute" => $this->latitute,
            "longitude" => $this->longitude,
            "country" => $this->country->country,
            "region" => $this->country->region,
        ];
    }
}
