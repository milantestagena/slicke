<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\UserItem;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\UserCollection;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CollectionsPublic;

class CollectionController extends Controller
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

    public function getCollections(){
        $data = Collection::getCollections();
        return $this->success(new CollectionsPublic($data));
    }

    public function setCollectionForUser(int $collectionId){
        try {
            $ucID = UserCollection::userCollection(Auth::user(), $collectionId)->id;
            if(!$ucID){
                $ucID = UserCollection::create([
                    'user_id' => $this->user->id,
                    'collection_id' => $collectionId
                ])->id;

                UserItem::createForUserCollection($ucID, $collectionId);
            }
            return $this->success(['UserCollectionId' =>  $ucID], 'OK');
        } catch (\Throwable $th) {
            throw $th;
            return $this->error('Collection not found', 400, $th);
        }
    }
}
