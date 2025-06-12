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
        Schema::create('technological_maps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
        });

        DB::statement('ALTER TABLE technological_maps ADD COLUMN cooking_time INTERVAL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technological_maps');
    }
};
