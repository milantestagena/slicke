<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\ItemsMatching;
use App\Traits\HttpResponses;
use App\Models\UserCollection;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CollectionsPublic;
use App\Http\Resources\UserCollectionPublic;
use App\Http\Requests\UpdateUserCollectionRequest;

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
    public function updateCollectionForUser($id, UpdateUserCollectionRequest $request){
       try {
        $data =json_decode($request->getContent());
        $userCollection = UserCollection::where('id', $id)->where('user_id', Auth::user()->id)->first();
        $userCollection->updateItems($data->items);
        $userCollection->updateMatchingEntities();
        ItemsMatching::rebuildMatching($userCollection);
        return $this->success("Success");
       } catch (\Throwable $th) {
        return $this->error('Update fail', 400, $th->getMessage());
       }
       
    }
}
