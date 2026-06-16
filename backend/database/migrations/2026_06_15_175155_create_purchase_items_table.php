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
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->foreignId('ingredient_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->decimal('quantity', 10, 2);      // allows fractional units
            $table->decimal('unit_price', 10, 2);    // cost per unit
            $table->decimal('total_price', 10, 2);   // precomputed total
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
