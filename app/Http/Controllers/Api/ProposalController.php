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

    public function getProposal(int $id){
        $proposal  = Proposal::findOrFail($id);
        if(!$proposal){
            return $this->error("Proposal not found");
        }
        try{
            $proposal->checkIfIsStillActive();
            return $this->success(new ProposalPublicResouce($proposal));
        } catch (\Throwable $th) {
            $proposal->state = 'not_possible';
            $proposal->save();
            return $this->error("Proposal not active", 400, $th->getMessage());
        }
    }
    public function acceptProposal(int $id){
        $proposal  = Proposal::findOrFail($id);
        if($proposal){
            $proposal->accept();
            return $this->success("Proposal accepted");
        } else {
            return $this->error("Proposal not found");
        }
    }
    public function refuseProposal(int $id){
        $proposal  = Proposal::findOrFail($id);
        if($proposal){
            $proposal->state = 'rejected';
            $proposal->save();
            return $this->success('Proposal rejected');
        } else {
            return $this->error("Proposal not found");
        }
    }
}
