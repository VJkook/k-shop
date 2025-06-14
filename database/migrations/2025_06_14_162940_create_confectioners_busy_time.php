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
        Schema::create('confectioners_busy_time', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_confectioner');
            $table->foreign('id_confectioner')->references('id')->on('users');

            $table->timestamp('work_date');
        });

        DB::statement('ALTER TABLE confectioners_busy_time ADD COLUMN busy_time INTERVAL NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('confectioners_busy_time');
    }
};
