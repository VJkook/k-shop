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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_ready_cake')->nullable();
            $table->foreign('id_ready_cake')->references('id')->on('ready_cakes');

            $table->unsignedBigInteger('id_cake_designer')->nullable();
            $table->foreign('id_cake_designer')->references('id')->on('cake_designers');
        });

        // Ограничение, что только одно из полей может быть заполнено
        DB::statement(
            '
            ALTER TABLE products
            ADD CONSTRAINT check_relations
            CHECK(
                (id_ready_cake IS NOT NULL AND id_cake_designer IS NULL) OR
                (id_ready_cake IS NULL AND id_cake_designer IS NOT NULL)
            )
            '
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
