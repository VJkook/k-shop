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
        Schema::create('ingredient_recipe_relations', function (Blueprint $table) {
            $table->id();
            $table->decimal('quantity');

            $table->unsignedBigInteger('id_ingredient');
            $table->foreign('id_ingredient')->references('id')->on('ingredients');

            $table->unsignedBigInteger('id_recipe');
            $table->foreign('id_recipe')->references('id')->on('recipes')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_recipe_relations');
    }
};
