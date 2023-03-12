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
        //
        Schema::table('users', function (Blueprint $table) {
            $table->string('fullname', 128)->nullable(false)->default(null);
            $table->string('mailing_address_street', 64)->nullable(false)->default(null);
            $table->string('mailing_address_number', 8)->nullable(false)->default(null);
            $table->string('mailing_address_postal', 16)->nullable(false)->default(null);
            $table->float('latitute')->nullable(false)->default(null);
            $table->float('longitude')->nullable(false)->default(null);
            $table->unsignedBigInteger('country_id');
            $table->unsignedBigInteger('membership_id');
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
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
        //
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone_number');
            $table->dropColumn('fullname');
            $table->dropColumn('mailing_address_street');
            $table->dropColumn('mailing_address_number');
            $table->dropColumn('mailing_address_postal');
            $table->dropColumn('latitute');
            $table->dropColumn('longitude');
            $table->dropColumn('country_id');
            $table->dropColumn('membership_id');
        });
    }
};
