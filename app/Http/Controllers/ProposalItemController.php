<?php

namespace App\Http\Controllers;

use App\Models\ProposalItem;
use App\Http\Requests\StoreProposalItemRequest;
use App\Http\Requests\UpdateProposalItemRequest;

class ProposalItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreProposalItemRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProposalItemRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProposalItem  $proposalItem
     * @return \Illuminate\Http\Response
     */
    public function show(ProposalItem $proposalItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProposalItem  $proposalItem
     * @return \Illuminate\Http\Response
     */
    public function edit(ProposalItem $proposalItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateProposalItemRequest  $request
     * @param  \App\Models\ProposalItem  $proposalItem
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProposalItemRequest $request, ProposalItem $proposalItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProposalItem  $proposalItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProposalItem $proposalItem)
    {
        //
    }
}
