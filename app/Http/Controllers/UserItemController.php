<?php

namespace App\Http\Controllers;

use App\Models\UserItem;
use App\Http\Requests\StoreUserItemRequest;
use App\Http\Requests\UpdateUserItemRequest;

class UserItemController extends Controller
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
     * @param  \App\Http\Requests\StoreUserItemRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserItemRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UserItem  $userItem
     * @return \Illuminate\Http\Response
     */
    public function show(UserItem $userItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\UserItem  $userItem
     * @return \Illuminate\Http\Response
     */
    public function edit(UserItem $userItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateUserItemRequest  $request
     * @param  \App\Models\UserItem  $userItem
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserItemRequest $request, UserItem $userItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserItem  $userItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserItem $userItem)
    {
        //
    }
}
