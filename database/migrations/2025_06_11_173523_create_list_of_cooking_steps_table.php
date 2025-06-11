<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('list_of_cooking_steps', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_cooking_step');
            $table->foreign('id_cooking_step')->references('id')->on('cooking_steps');

            $table->unsignedBigInteger('id_technological_map');
            $table->foreign('id_technological_map')->references('id')->on('technological_maps');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('list_of_cooking_steps');
    }
};
