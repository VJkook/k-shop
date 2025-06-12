<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cooking_steps', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->integer('step_number');

            $table->unsignedBigInteger('id_image')->nullable();
            $table->foreign('id_image')->references('id')->on('images');
        });

        DB::statement('ALTER TABLE cooking_steps ADD COLUMN step_time INTERVAL NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cooking_steps');
    }
};
