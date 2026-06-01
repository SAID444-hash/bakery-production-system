<script setup>
import { ref, computed } from 'vue'
import StockIndicator from '../components/StockIndicator.vue'
import BatchCard from '../components/BatchCard.vue'

const ingredients = ref([
  { id: 1, name: 'Wheat Flour', current_stock: 50, reorder_level: 20, unit: 'kg', cost_per_unit: 100 },
  { id: 2, name: 'Cinnamon', current_stock: 0.4, reorder_level: 0.5, unit: 'kg', cost_per_unit: 1200 },
  { id: 3, name: 'Eggs', current_stock: 120, reorder_level: 50, unit: 'pcs', cost_per_unit: 15 },
])

// SAMPLE DATA: PRODUCTION_BATCHES

// GET /api/production-batches response includes product_name from JOIN with PRODUCTS:

const batches = ref([
  {
    id: 1,
    product_name: 'White Bread',
    product_id: 1,
    planned_quantity: 50,
    actual_quantity: 47,
    wastage_quantity: 3,
    status: 'done',
    started_at: '2026-05-20 06:30',
    completed_at: '2026-05-20 08:15'
  },
  {
    id: 2,
    product_name: 'Chocolate Cake',
    product_id: 2,
    planned_quantity: 30,
    actual_quantity: null,
    wastage_quantity: null,
    status: 'mixing',
    started_at: '2026-05-30 07:00',
    completed_at: null
  },
  {
    id: 3,
    product_name: 'Chocolate Cake',
    product_id: 2,
    planned_quantity: 20,
    actual_quantity: 18,
    wastage_quantity: 2,
    status: 'done',
    started_at: '2026-05-31 06:30',
    completed_at: '2026-05-31 09:00'
  },
  {
    id: 4,
    product_name: 'Cinnamon Roll',
    product_id: 3,
    planned_quantity: 30,
    actual_quantity: null,
    wastage_quantity: 0,
    status: 'planned',
    started_at: null,
    completed_at: null
  },
  {
    id: 5,
    product_name: 'White Bread',
    product_id: 1,
    planned_quantity: 50,
    actual_quantity: 35,
    wastage_quantity: 15,
    status: 'done',
    started_at: '2026-05-28 05:00',
    completed_at: '2026-05-28 07:00'
  },
  {
    id: 6,
    product_name: 'Meat Pie',
    product_id: 4,
    planned_quantity: 40,
    actual_quantity: null,
    wastage_quantity: 0,
    status: 'baking',
    started_at: '2026-06-01 10:00',
    completed_at: null
  },
])

// UI state for completion panel
const showCompletionPanel = ref(false)
const completionActual = ref(0)
const completionWastage = ref(0)
const selectedBatchId = ref(null)

function openCompletionPanel(batchId) {
  const b = batches.value.find(x => x.id === batchId)
  if (!b) return
  selectedBatchId.value = batchId
  completionActual.value = b.planned_quantity || 0
  completionWastage.value = b.wastage_quantity || 0
  showCompletionPanel.value = true
}

function confirmCompletion() {
  const b = batches.value.find(x => x.id === selectedBatchId.value)
  if (!b) return
  b.actual_quantity = Number(completionActual.value)
  b.wastage_quantity = Number(completionWastage.value)
  b.status = 'done'
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  b.completed_at = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  showCompletionPanel.value = false
  selectedBatchId.value = null
}

function markFailed(batchId) {
  const b = batches.value.find(x => x.id === batchId)
  if (!b) return
  b.status = 'failed'
}

const totalValue = computed(() =>
  ingredients.value.reduce((sum, i) => sum + i.current_stock * i.cost_per_unit, 0)
)
const needsReorder = computed(() =>
  ingredients.value.filter(i => i.current_stock < i.reorder_level).length
)
const wellStocked = computed(() =>
  ingredients.value.filter(i => i.current_stock >= i.reorder_level).length
)

const inProgressCount = computed(() =>
  batches.value.filter(b => ['mixing', 'baking', 'cooling'].includes(b.status)).length
)
const lowYieldCount = computed(() =>
  batches.value.filter(b => b.actual_quantity !== null && b.planned_quantity > 0 && (b.actual_quantity / b.planned_quantity) < 0.8).length
)

function advanceBatch(batchId, newStatus) {

  const batch = batches.value.find(b => b.id === batchId)
  if (batch) {
    batch.status = newStatus  
    if (newStatus === 'done') {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      batch.completed_at = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    }
    // await axios.post(`/api/production-batches/${batchId}/advance`, { status: newStatus })
    // this triggers DB::transaction() - stock deduction - cost recording
  }
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[#1A1A2E]">Baker's Dashboard</h1>
      <p class="text-gray-500 text-sm mt-1">Today's production overview</p>
    </div>

    <!-- Summary stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Inventory Value</p>
        <p class="text-2xl font-bold text-[#1A1A2E] mt-1">KES {{ totalValue.toLocaleString() }}</p>
      </div>
      <div
        class="bg-white rounded-xl p-4 shadow-sm border"
        :class="needsReorder > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'"
      >
        <p class="text-xs font-medium uppercase tracking-wide"
           :class="needsReorder > 0 ? 'text-red-500' : 'text-gray-400'">
          Needs Reorder
        </p>
        <p class="text-2xl font-bold mt-1"
           :class="needsReorder > 0 ? 'text-red-600' : 'text-[#1A1A2E]'">
          {{ needsReorder }}
        </p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Well Stocked</p>
        <p class="text-2xl font-bold text-emerald-600 mt-1">{{ wellStocked }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">In Progress</p>
        <p class="text-2xl font-bold text-[#1A1A2E] mt-1">{{ inProgressCount }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Low Yield (&lt;80%)</p>
        <p class="text-2xl font-bold text-red-600 mt-1">{{ lowYieldCount }}</p>
      </div>
    </div>

    <!-- Ingredient stock -->
    <h2 class="text-lg font-semibold text-[#1A1A2E] mb-3">Ingredient Stock</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StockIndicator
        v-for="ing in ingredients"
        :key="ing.id"
        :name="ing.name"
        :current="ing.current_stock"
        :reorder="ing.reorder_level"
        :unit="ing.unit"
        :cost-per-unit="ing.cost_per_unit"
      />
    </div>

    <!-- Production batches -->
    <h2 class="text-lg font-semibold text-[#1A1A2E] mb-3">Production Batches</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <BatchCard
        v-for="batch in batches"
        :key="batch.id"
        :batch="batch"
        @advance-batch="advanceBatch"
        @request-complete="openCompletionPanel"
        @mark-failed="markFailed"
      />
    </div>

    <!-- Completion panel for cooling batches -->
    <div v-if="showCompletionPanel" class="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 class="font-semibold text-[#1A1A2E] mb-3">Complete Batch</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-sm text-gray-500">Actual quantity</label>
          <input type="number" v-model.number="completionActual" class="mt-1 w-full rounded-md border p-2" />
        </div>
        <div>
          <label class="text-sm text-gray-500">Wastage quantity</label>
          <input type="number" v-model.number="completionWastage" class="mt-1 w-full rounded-md border p-2" />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="confirmCompletion" class="px-4 py-2 bg-emerald-600 text-white rounded-md">Confirm</button>
        <button @click="showCompletionPanel = false" class="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
      </div>
    </div>
  </div>
</template>
