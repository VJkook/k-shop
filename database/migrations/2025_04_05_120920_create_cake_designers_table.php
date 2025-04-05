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
        Schema::create('cake_designers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->decimal('weight', 12, 2)->nullable();
            $table->integer('number_of_cake_tiers');
            $table->string('coverage');
            $table->decimal('total_cost', 12, 2);

            $table->unsignedBigInteger('id_product');
            $table->foreign('id_product')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cake_designers');
    }
};
