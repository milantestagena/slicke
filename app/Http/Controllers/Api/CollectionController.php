<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller
{
    //
    use HttpResponses;
    private $user;
    private $userModel;
    public function _construct()
    {
        parent::_construct();
        $this->user = Auth::user();
        $this->userModel = User::where('id', $this->user->id)->first();
    }

    public function getCollectionsForUser(){
        $data = Collection::getCollectionsForUser($this->user);
        return $this->success($data);
    }

    public function getCollectionForUser(Request $request){

        $data = $this->userModel->getCollection($request->query('id'));
        return $this->success($data->items());
    }
}
