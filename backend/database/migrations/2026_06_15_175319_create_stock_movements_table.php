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
        Schema::create('stock_movements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ingredient_id')
          ->constrained()
          ->onDelete('cascade');
    $table->enum('movement_type', ['in', 'out']);
    $table->integer('quantity');
    $table->string('reference')->nullable(); // e.g. purchase_order_id or receipt_id
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
