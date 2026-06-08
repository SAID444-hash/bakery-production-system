<script setup>
import { ref, computed } from 'vue'
import StockIndicator from '../components/StockIndicator.vue'
import BatchCard from '../components/BatchCard.vue'
import { useIngredientStore } from '../stores/ingredientStore'
import { useBatchStore } from '../stores/batchStore'
import { useProductStore } from '../stores/productStore'

const ingredientStore = useIngredientStore()
const batchStore = useBatchStore()
const productStore = useProductStore()

// ✅ FIX: define missing variable safely
const needsReorder = computed(() => ingredientStore.lowStockCount)
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[#1A1A2E]">Baker's Dashboard</h1>
      <p class="text-gray-500 text-sm mt-1">Today's production overview</p>
    </div>

    <!-- Summary stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Inventory Value</p>
        <p class="text-2xl font-bold text-[#1A1A2E] mt-1">
          KES {{ ingredientStore.totalValue }}
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm text-center">
        <span class="block text-3xl font-bold text-[#1A1A2E]">
          {{ productStore.productCount }}
        </span>
        <span class="text-sm text-gray-500">Products</span>
      </div>

      <!-- Needs Reorder -->
      <div
        class="bg-white rounded-xl p-4 shadow-sm border"
        :class="ingredientStore.lowStockCount > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'"
      >
        <p class="text-xs font-medium uppercase tracking-wide"
           :class="ingredientStore.lowStockCount > 0 ? 'text-red-500' : 'text-gray-400'">
          Needs Reorder
        </p>

        <p class="text-2xl font-bold mt-1"
           :class="needsReorder > 0 ? 'text-red-600' : 'text-[#1A1A2E]'">
          {{ ingredientStore.lowStockCount }}
        </p>
      </div>

      <!-- Well Stocked -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
          Well Stocked
        </p>
        <p class="text-2xl font-bold text-emerald-600 mt-1">
          {{ ingredientStore.lowStockCount }}
        </p>
      </div>

      <!-- In Progress -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
          In Progress
        </p>
        <p class="text-2xl font-bold text-blue-600 mt-1">
          {{ batchStore.inProgressCount }}
        </p>
      </div>
    </div>

    <!-- Ingredient stock -->
    <h2 class="text-lg font-semibold text-[#1A1A2E] mb-3">Ingredient Stock</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StockIndicator
        v-for="ing in ingredientStore.ingredients"
        :key="ing.id"
        :name="ing.name"
        :current="ing.current_stock"
        :reorder="ing.reorder_level"
        :unit="ing.unit"
        :cost-per-unit="ing.cost_per_unit"
      />
    </div>

    <!-- Production batches -->
    <h2 class="text-lg font-semibold text-[#1A1A2E] mt-8 mb-3">Production Batches</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <BatchCard
        v-for="batch in batchStore.batches"
        :key="batch.id"
        :batch="batch"
        @advance-batch="batchStore.advanceBatch"
      />
    </div>
  </div>
</template>