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
        Schema::create('ingredients_of_recipe', function (Blueprint $table) {
            $table->id();
            $table->decimal('quantity');

            $table->unsignedBigInteger('id_ingredient');
            $table->foreign('id_ingredient')->references('id')->on('ingredients');

            $table->unsignedBigInteger('id_recipe');
            $table->foreign('id_recipe')->references('id')->on('recipes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients_of_recipe');
    }
};
