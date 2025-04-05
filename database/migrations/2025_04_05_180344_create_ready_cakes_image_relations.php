<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ready_cake_image_relations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_ready_cake');
            $table->unsignedBigInteger('id_image');

            $table->foreign('id_ready_cake')->references('id')->on('ready_cakes');
            $table->foreign('id_image')->references('id')->on('images');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ready_cake_image_relations');
    }
};
