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
        Schema::create('items_matching', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('collection_id');
            $table->unsignedBigInteger('user_1_id');
            $table->unsignedBigInteger('user_2_id');
            $table->smallInteger('item_count_1');
            $table->smallInteger('item_count_2');
            $table->string('item_ids_1', 2048);
            $table->string('item_ids_2', 2048);
            $table->foreign('user_1_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_2_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('collection_id')->references('id')->on('collections')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items_matching');
    }
};
