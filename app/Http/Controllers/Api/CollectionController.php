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

    public function getCollections()
    {
        $data = Collection::getCollections();
        return $this->success(new CollectionsPublic($data));
    }

    public function getAvailableCollections()
    {
        $data = Collection::getAvailableCollections(Auth::user());
        return $this->success(new CollectionsPublic($data));
    }

    public function setCollectionForUser(int $collectionId)
    {
        try {
            $ucID = UserCollection::userCollection(Auth::user()->id, $collectionId)->id;
            UserItem::createForUserCollection($ucID, $collectionId);
            return $this->success(['UserCollectionId' => $ucID], 'OK');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'link' => 'nullable|string',
            'year' => 'nullable|integer',
            'items' => 'array',
            'countries' => 'array',
        ]);

        $collection = Collection::create($validated);

        // TODO: save related items and countries if needed
        return response()->json($collection);
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'link' => 'nullable|string',
            'year' => 'nullable|integer',
            'items' => 'array',
            'countries' => 'array',
        ]);

        $collection->update($validated);

        // TODO: update related items and countries if needed
        return response()->json($collection);
    }

}
