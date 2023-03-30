<?php

namespace App\Http\Controllers\Api;

use App\Models\Membership;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\MembershipPublicResource;

class MembershipController extends Controller
{
    use HttpResponses;
    //
    public function getAll(){
        $data = Membership::all();;
        return $this->success(new MembershipPublicResource($data));
    }
}
