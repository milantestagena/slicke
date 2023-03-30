<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\CountryPublicResource;
use App\Models\Countries;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
    use HttpResponses;
    //
    public function getAll(){
        $data = Countries::where('active', '=', 1)->get();
        return $this->success(new CountryPublicResource($data));
    }
}
