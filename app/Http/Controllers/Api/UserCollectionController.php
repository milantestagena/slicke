<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\UserCollection;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserColectionPublic;

class UserCollectionController extends Controller
{
    //
    use HttpResponses;
    private $user;
    private $userModel;
    private function setUser()
    {
        $this->user = Auth::user();
        $this->userModel = User::where('id', $this->user->id)->first();
    }
    public function getCollectionsForUser(){
        $data = UserCollection::userCollections($this->user);
        return $this->success(new UserColectionPublic($data));
    }
    public function getCollectionForUser(int $collectionId){
        $data = UserCollection::userCollection($this->user, $collectionId);
        return $this->success(new UserColectionPublic($data));
    }
    public function updateCollectionForUser(){
        $data = UserCollection::getCollections();
        return $this->success(new UserColectionPublic($data));
    }
}
