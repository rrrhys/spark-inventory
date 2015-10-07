<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMovementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movements', function (Blueprint $table) {

            $table->increments('id');
            $table->integer('item_id')->nullable();
            $table->string('description');
            $table->string('quantity');
            $table->string('reference');
            $table->integer('user_id')->nullable();
            $table->softDeletes();

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
        //
        Schema::drop('movements');
    }
}
