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
        Schema::create('cake_designers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->decimal('weight')->nullable();
            $table->text('description')->nullable();
            $table->decimal('total_cost', 12, 2)->nullable();

            $table->unsignedBigInteger('id_coverage');
            $table->foreign('id_coverage')->references('id')->on('coverages');

            $table->unsignedBigInteger('id_cake_form');
            $table->foreign('id_cake_form')->references('id')->on('cake_forms');

            $table->unsignedBigInteger('id_user');
            $table->foreign('id_user')->references('id')->on('users');
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
