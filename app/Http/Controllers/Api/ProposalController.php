<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApiProposalRequest;
use App\Models\Proposal;
use App\Models\UserCollection;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProposalController extends Controller
{
    use HttpResponses;
    //
    public function createProposal(StoreApiProposalRequest $request){
        $data = (object)$request->validated();
        $user = Auth::user();
        // check if offer and need are valid
        try {
            UserCollection::checkForDoubles($data->collection_id, $user->id, $data->offer);
            UserCollection::checkForDoubles($data->collection_id, $data->receiver_id, $data->need);

            $proposal = new Proposal( );
            $proposal->sender_id = $user->id;
            $proposal->receiver_id = $data->receiver_id;
            $proposal->collection_id = $data->collection_id;
            $proposal->save();
            $proposal->createItems($user->id, $data->offer);
            $proposal->createItems($data->receiver_id, $data->need);

            return $this->success('Proposal created');
        } catch (\Throwable $th) {
            return $this->error('Proposal not created', 400, $th->getMessage());
        }

    }
}
