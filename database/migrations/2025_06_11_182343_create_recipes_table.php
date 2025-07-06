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
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();

            $table->unsignedBigInteger('id_ready_cake')->unique()->nullable();
            $table->foreign('id_ready_cake')->references('id')->on('ready_cakes');

            $table->unsignedBigInteger('id_filling')->unique()->nullable();
            $table->foreign('id_filling')->references('id')->on('fillings');

            $table->unsignedBigInteger('id_decor')->unique()->nullable();
            $table->foreign('id_decor')->references('id')->on('decors');

            $table->unsignedBigInteger('id_technological_map')->unique()->nullable();
            $table->foreign('id_technological_map')->references('id')->on('technological_maps');
        });

        // Ограничение, что только одно из полей может быть заполнено
        DB::statement(
            '
            ALTER TABLE recipes
            ADD CONSTRAINT check_relations
            CHECK(
                (id_ready_cake IS NOT NULL AND id_filling IS NULL AND id_decor IS NULL) OR
                (id_filling IS NOT NULL AND id_ready_cake IS NULL AND id_decor IS NULL) OR
                (id_decor IS NOT NULL AND id_ready_cake IS NULL AND id_filling IS NULL)
            )
            '
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
