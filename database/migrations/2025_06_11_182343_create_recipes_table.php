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
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            $table->unsignedBigInteger('id_ready_cake');
            $table->foreign('id_ready_cake')->references('id')->on('ready_cakes');

            $table->unsignedBigInteger('id_filling');
            $table->foreign('id_filling')->references('id')->on('fillings');

            $table->unsignedBigInteger('id_decor');
            $table->foreign('id_decor')->references('id')->on('decors');

            $table->unsignedBigInteger('id_technological_map');
            $table->foreign('id_technological_map')->references('id')->on('technological_maps');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
