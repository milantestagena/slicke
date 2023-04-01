<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use App\Models\UserCollection;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use HttpResponses;

    public function getUsersForCollection(int $collectionId, string $term){
        try{
            $userCollection = UserCollection::
                where('collection_id', '=', $collectionId)->
                where('user_id', '=', Auth::user()->id)->//toSql();
                first();
            $users = User::getUsersForCollection($userCollection->collection->id, $term)->pluck('name', 'id');

            if($users){
                return $this->success((object)$users);
            } else {
                return $this->error("User not found", 400);
            }
        }catch (\Throwable $th) {
            return $this->error("User not found", 400, $th->getMessage());
        }
    }

    public function getUsers(string $term){
        $users = User::getUsers($term)->pluck('name', 'id')->toArray();

        if($users){
            return $this->success((object)$users);
        } else {
            return $this->error("User not found", 400);
        }

    }
}
