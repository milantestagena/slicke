<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\UserCollection;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CollectionsPublic;
use App\Http\Resources\UserCollectionPublic;

class UserCollectionController extends Controller
{
    //
    use HttpResponses;
    private $user;
    private $userModel;

    public function getCollectionsForUser(){
        $data = UserCollection::userCollections(Auth::user());
        return $this->success(new CollectionsPublic($data));
    }
    public function getCollectionForUser(int $collectionId){
        $data = UserCollection::findOrFail($collectionId);
   
        return $this->success(new UserCollectionPublic($data));
    }
    public function updateCollectionForUser(){
        $data = UserCollection::getCollections();
        return $this->success(new UserCollectionPublic($data));
    }
}
