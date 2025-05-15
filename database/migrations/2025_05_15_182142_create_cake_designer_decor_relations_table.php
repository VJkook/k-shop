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
        Schema::create('cake_designer_decor_relations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_decor');
            $table->unsignedBigInteger('id_cake_designer');
            $table->integer('count');

            $table->foreign('id_decor')->references('id')->on('decors');
            $table->foreign('id_cake_designer')->references('id')->on('cake_designers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cake_designer_decor_relations');
    }
};
