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
        Schema::create('fillings', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->text('description');
            $table->decimal('price_by_kg', 12, 2);

            $table->unsignedBigInteger('id_image');
            $table->foreign('id_image')->references('id')->on('images');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fillings');
    }
};
