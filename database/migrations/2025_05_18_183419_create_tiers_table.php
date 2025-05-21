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
        Schema::create('tiers', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_cake_designer');
            $table->foreign('id_cake_designer')->references('id')->on('cake_designers')->cascadeOnDelete();

            $table->unsignedBigInteger('id_filling');
            $table->foreign('id_filling')->references('id')->on('fillings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiers');
    }
};
