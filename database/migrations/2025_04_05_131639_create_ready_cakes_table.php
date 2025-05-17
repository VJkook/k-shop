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
        Schema::create('ready_cakes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->decimal('weight', 12, 2)->nullable();
            $table->text('composition')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ready_cakes');
    }
};
