<?php

namespace App\Http\Controllers;

use App\Models\MembershipPricePerCountry;
use App\Http\Requests\StoreMembershipPricePerCountryRequest;
use App\Http\Requests\UpdateMembershipPricePerCountryRequest;

class MembershipPricePerCountryController extends Controller
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
     * @param  \App\Http\Requests\StoreMembershipPricePerCountryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMembershipPricePerCountryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MembershipPricePerCountry  $membershipPricePerCountry
     * @return \Illuminate\Http\Response
     */
    public function show(MembershipPricePerCountry $membershipPricePerCountry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MembershipPricePerCountry  $membershipPricePerCountry
     * @return \Illuminate\Http\Response
     */
    public function edit(MembershipPricePerCountry $membershipPricePerCountry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMembershipPricePerCountryRequest  $request
     * @param  \App\Models\MembershipPricePerCountry  $membershipPricePerCountry
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMembershipPricePerCountryRequest $request, MembershipPricePerCountry $membershipPricePerCountry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MembershipPricePerCountry  $membershipPricePerCountry
     * @return \Illuminate\Http\Response
     */
    public function destroy(MembershipPricePerCountry $membershipPricePerCountry)
    {
        //
    }
}
