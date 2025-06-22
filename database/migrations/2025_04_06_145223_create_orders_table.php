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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->decimal('total_cost', 12, 2);
            $table->timestamp('registration_date');
            $table->timestamp('delivery_date');
            $table->timestamp('complete_date')->nullable();
            $table->date('work_date')->nullable();

            $table->unsignedBigInteger('id_user');
            $table->foreign('id_user')->references('id')->on('users');

            $table->unsignedBigInteger('id_delivery_address');
            $table->foreign('id_delivery_address')->references('id')->on('delivery_addresses');

            $table->unsignedBigInteger('id_payment_status');
            $table->foreign('id_payment_status')->references('id')->on('payment_statuses');

            $table->unsignedBigInteger('id_order_status');
            $table->foreign('id_order_status')->references('id')->on('order_statuses');

            $table->unsignedBigInteger('id_confectioner')->nullable();
            $table->foreign('id_confectioner')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
