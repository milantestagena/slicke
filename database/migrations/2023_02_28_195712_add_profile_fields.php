<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('fullname',200);
            $table->string('country',64);
            $table->string('region',64);
            $table->string('mailing_address_street',64);
            $table->string('mailing_address_number',8);
            $table->string('mailing_address_postal',16);
            $table->float('latitute');
            $table->float('longitude');
            $table->foreign('membership_id')->references('id')->on('memberships')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['fullname', 'country', 'region', 'mailing_address_street', 'mailing_address_number', 'mailing_address_postal', 'latitute', 'longitude', 'membership_id']);
        });
    }
};
