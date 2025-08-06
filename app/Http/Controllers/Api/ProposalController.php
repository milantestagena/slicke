<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApiProposalRequest;
use App\Http\Resources\ProposalPublicResouce;
use App\Models\Proposal;
use App\Models\UserCollection;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProposalController extends Controller
{
    use HttpResponses;
    //
    public function createProposal(StoreApiProposalRequest $request)
    {
        $data = (object) $request->validated();
        $user = Auth::user();

        // check if offer and need are valid
        try {
            UserCollection::checkForDoubles($data->collection_id, $user->id, $data->offer);
            UserCollection::checkForDoubles($data->collection_id, $data->receiver_id, $data->need);

            // Dohvati user_collection_id za oba korisnika
            $userCollectionIds = \DB::table('user_collections')
                ->where('collection_id', $data->collection_id)
                ->whereIn('user_id', [$user->id, $data->receiver_id])
                ->pluck('id', 'user_id');
            // Zameni offer/need iz identifier u user_item.id
            $data->offer = \DB::table('user_items')
                ->whereIn('item_id', $data->offer)
                ->where('user_collection_id', $userCollectionIds[$user->id] ?? 0)
                ->pluck('id')
                ->toArray();

            $data->need = \DB::table('user_items')
                ->whereIn('item_id', $data->need)
                ->where('user_collection_id', $userCollectionIds[$data->receiver_id] ?? 0)
                ->pluck('id')
                ->toArray();

            $proposal = new Proposal();
            $proposal->sender_id = $user->id;
            $proposal->receiver_id = $data->receiver_id;
            $proposal->collection_id = $data->collection_id;
            $proposal->save();
            //return $this->error('Proposal not created', 400, [$user->id, $userCollectionIds[$user->id], $data->offer, $data->receiver_id, $userCollectionIds[$data->receiver_id], $data->need]);
            $proposal->createItems($user->id, $data->offer);
            $proposal->createItems($data->receiver_id, $data->need);

            return $this->success('Proposal created');
        } catch (\Throwable $th) {
            return $this->error('Proposal not created', 400, $th->getMessage());
        }

    }

    public function getProposals($collection_id)
    {
        $user = Auth::user();
        $userId = $user->id;

        // First, proposals where user is receiver
        $asReceiver = Proposal::where('receiver_id', $userId)->where('collection_id', $collection_id)->get();

        // Then, proposals where user is sender (but not also receiver)
        $asSender = Proposal::where('sender_id', $userId)->where('collection_id', $collection_id)->get();

        // Merge collections: receiver proposals first, then sender proposals
        $proposals = $asReceiver->concat($asSender);

        if ($proposals->isEmpty()) {
            return $this->error("No proposals found for this user");
        }

        try {
            $result = $proposals->map(function ($proposal) {
                try {
                    $proposal->checkIfIsStillActive();
                    return new ProposalPublicResouce($proposal);
                } catch (\Throwable $th) {
                    // Skip this proposal by returning null
                    return null;
                }
            })->filter(); // Removes nulls

            return $this->success($result->values());
        } catch (\Throwable $th) {
            return $this->error("Error fetching proposals", 400, $th->getMessage());
        }
    }

    public function getProposal(int $id)
    {
        $proposal = Proposal::findOrFail($id);
        if (!$proposal) {
            return $this->error("Proposal not found");
        }
        try {
            $proposal->checkIfIsStillActive();
            return $this->success(new ProposalPublicResouce($proposal));
        } catch (\Throwable $th) {
            $proposal->state = 'not_possible';
            $proposal->save();
            return $this->error("Proposal not active", 400, $th->getMessage());
        }
    }
    public function acceptProposal(int $id)
    {
        $proposal = Proposal::findOrFail($id);
        if ($proposal) {
            $proposal->accept();
            return $this->success("Proposal accepted");
        } else {
            return $this->error("Proposal not found");
        }
    }
    public function refuseProposal(int $id)
    {
        $proposal = Proposal::findOrFail($id);
        if ($proposal) {
            $proposal->state = 'rejected';
            $proposal->save();
            return $this->success('Proposal rejected');
        } else {
            return $this->error("Proposal not found");
        }
    }
}
