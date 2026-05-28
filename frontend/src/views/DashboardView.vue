<script setup>
import { computed, ref } from 'vue'
import { computed, ref } from 'vue'
import StockIndicator from '../components/StockIndicator.vue'

const ingredients = ref([
  { id: 1, name: 'Wheat Flour', current_stock: 50, reorder_level: 20, unit: 'kg', cost_per_unit: 100 },
  { id: 2, name: 'Cinnamon', current_stock: 0.4, reorder_level: 0.5, unit: 'kg', cost_per_unit: 1200 },
  { id: 3, name: 'Eggs', current_stock: 120, reorder_level: 50, unit: 'pcs', cost_per_unit: 15 },
  { id: 4, name: 'Yeast', current_stock: 2, reorder_level: 1, unit: 'kg', cost_per_unit: 800 },
  { id: 5, name: 'Sugar', current_stock: 30, reorder_level: 10, unit: 'kg', cost_per_unit: 150 },
  { id: 6, name: 'Cocoa Powder', current_stock: 5, reorder_level: 3, unit: 'kg', cost_per_unit: 600 },
  { id: 7, name: 'Butter', current_stock: 8, reorder_level: 5, unit: 'kg', cost_per_unit: 500 },
  { id: 8, name: 'Milk', current_stock: 20, reorder_level: 10, unit: 'litre', cost_per_unit: 70 },
])

const lowStockCount = computed(() => ingredients.value.filter((item) => item.current_stock < item.reorder_level).length)

const totalStockValue = computed(() =>
  ingredients.value.reduce((sum, item) => sum + item.current_stock * item.cost_per_unit, 0)
)

const statusSeverity = (item) => {
  if (item.current_stock <= 0) return 0
  if (item.current_stock < item.reorder_level) return 0
  if (item.current_stock < item.reorder_level * 2) return 1
  return 2
}

const sortedIngredients = computed(() =>
  [...ingredients.value].sort((a, b) => {
    const diff = statusSeverity(a) - statusSeverity(b)
    return diff !== 0 ? diff : a.name.localeCompare(b.name)
  })
)
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-semibold text-slate-900">Baker's Dashboard</h1>
      <p class="text-slate-600">Ingredient Stock</p>
    </div>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-wide text-red-700">Stock alert</p>
        <p class="mt-2 text-lg font-semibold">⚠️ {{ lowStockCount }} ingredient{{ lowStockCount === 1 ? '' : 's' }} need{{ lowStockCount === 1 ? 's' : '' }} reordering</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-600">Inventory value</p>
        <p class="mt-2 text-lg font-semibold">Total stock value: KES {{ totalStockValue.toLocaleString() }}</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StockIndicator
        v-for="ing in sortedIngredients"
        v-for="ing in sortedIngredients"
        :key="ing.id"
        :name="ing.name"
        :current="ing.current_stock"
        :reorder="ing.reorder_level"
        :unit="ing.unit"
        :cost-per-unit="ing.cost_per_unit"
      />
    </div>
  </div>
</template>

