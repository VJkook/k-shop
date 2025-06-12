<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('max_time_for_cooking', function (Blueprint $table) {
            $table->id();
        });

        DB::statement('ALTER TABLE max_time_for_cooking ADD COLUMN time INTERVAL NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('max_time_for_cooking');
    }
};
