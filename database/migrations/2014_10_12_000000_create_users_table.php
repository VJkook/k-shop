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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone', 20)->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->unsignedBigInteger('id_role');
            $table->foreign('id_role')->references('id')->on('roles');
        });

        DB::statement('ALTER TABLE users ADD CONSTRAINT check_phone_format CHECK (phone ~ \'^\+?[0-9\s\-\(\)]{7,}$\')');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
