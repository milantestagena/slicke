<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\UserCollectionController;
use App\Models\ItemsMatching;
use App\Models\UserCollection;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class ItemsMatchingController extends Controller
{
    use HttpResponses;
    public function getMatchesForUser(int $userCollectionId){
        $userCollection = UserCollection::findOrFail($userCollectionId);
        $matching = ItemsMatching::getMatchesForUser($userCollection->collection->id, $userCollection->user);
        $matching = array_slice($matching, 0, $userCollection->user->membership->number_of_matches);
        return $this->success($matching);
    }
}
