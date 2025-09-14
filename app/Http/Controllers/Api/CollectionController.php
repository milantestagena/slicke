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

        // Save related items if provided
        if (!empty($validated['items'])) {
            // For HasMany, create new items for the collection
            foreach ($validated['items'] as $itemData) {
                $collection->items()->create($itemData);
            }
        }

        // Save related countries if provided
        if (!empty($validated['countries'])) {
            // Assuming you have a relationship 'countries' defined in Collection model
            $collection->countries()->detach();
            $collection->countries()->attach($validated['countries']);
        }

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

        // Update related items if provided
        // Save related items if provided
        if (!empty($validated['items'])) {
            // For HasMany, create new items for the collection
            // Update existing items and add new ones, keep track of processed IDs
            $existingItemIds = $collection->items()->pluck('id')->toArray();
            $processedIds = [];

            foreach ($validated['items'] as $itemData) {
                if (isset($itemData['id'])) {
                    // Update existing item
                    $item = $collection->items()->where('id', $itemData['id'])->first();
                    if ($item) {
                        $item->update($itemData);
                        $processedIds[] = $item->id;
                    }
                } else {
                    // Create new item
                    $newItem = $collection->items()->create($itemData);
                    $processedIds[] = $newItem->id;
                }
            }

            // Delete items that were not included in the request
            $itemsToDelete = array_diff($existingItemIds, $processedIds);
            if (!empty($itemsToDelete)) {
                $collection->items()->whereIn('id', $itemsToDelete)->delete();
            }
        }

        // Update related countries if provided
        if (!empty($validated['countries'])) {
            $collection->countries()->detach();
            $collection->countries()->attach($validated['countries']);
        }
        return response()->json($collection);
    }

    public function updateMany(Request $request)
    {
        $validated = $request->validate([
            'collections' => 'required|array',
            'collections.*.id' => 'required|integer|exists:collections,id',
            'collections.*.type' => 'required|string',
            'collections.*.name' => 'required|string',
            'collections.*.description' => 'nullable|string',
            'collections.*.link' => 'nullable|string',
            'collections.*.year' => 'nullable|integer',
            'collections.*.items' => 'array',
            'collections.*.countries' => 'array',
        ]);

        $updated = [];
        foreach ($validated['collections'] as $colData) {
            $collection = Collection::findOrFail($colData['id']);
            $collection->update($colData);
            // TODO: update related items and countries if needed
            $updated[] = $collection;
        }

        return response()->json($updated);
    }

    public function delete($id)
    {
        $collection = Collection::findOrFail($id);

        // Delete all related items (if BelongsToMany) or delete (if HasMany)
        if (method_exists($collection, 'items')) {
            $itemsRelation = $collection->items();
            // Only call detach if the relation is BelongsToMany
            if ($itemsRelation instanceof \Illuminate\Database\Eloquent\Relations\BelongsToMany) {
                $itemsRelation->detach();
            } else {
                $itemsRelation->delete();
            }
        }

        // Delete all related countries (if HasMany) or detach (if BelongsToMany)
        if (method_exists($collection, 'countries')) {
            $countriesRelation = $collection->countries();
            if (method_exists($countriesRelation, 'detach')) {
                $countriesRelation->detach();
            } else {
                $countriesRelation->delete();
            }
        }
        // Cascade delete all related user collections and their user items
        $userCollections = UserCollection::where('collection_id', $id)->get();
        foreach ($userCollections as $userCollection) {
            // Delete related user items
            UserItem::where('user_collection_id', $userCollection->id)->delete();
            // Delete the user collection itself
            $userCollection->delete();
        }

        // Delete the collection itself
        $collection->delete();

        return response()->json(['message' => 'Collection and related items deleted successfully.']);
    }


}
