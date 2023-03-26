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
        Schema::table('proposal_items', function(Blueprint $table) {
            $table->dropForeign(['item_id']);
            $table->renameColumn('item_id', 'user_item_id');
            $table->foreign('user_item_id')
                ->references('id')
                ->on('user_items')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proposal_items', function(Blueprint $table) {
            $table->dropForeign(['user_item_id']);
            $table->renameColumn('user_item_id', 'item_id');
            $table->foreign('item_id')
                ->references('id')
                ->on('items')
                ->onDelete('cascade');
        });
    }
};
