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
        Schema::create('cake_designer_image_relation', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_cake_designer');
            $table->foreign('id_cake_designer')->references('id')->on('ready_cakes');

            $table->unsignedBigInteger('id_image');
            $table->foreign('id_image')->references('id')->on('images');

            $table->unique(['id_cake_designer', 'id_image']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cake_designer_image_relation');
    }
};
