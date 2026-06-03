<script setup>
import { computed, ref } from 'vue'

const products = ref([
  { id: 1, name: 'White Bread', category: 'bread', selling_price: 60, available_stock: 45, unit: 'loaf', shelf_life_hours: 24, is_active: true },
  { id: 2, name: 'Chocolate Cake', category: 'cake', selling_price: 350, available_stock: 8, unit: 'piece', shelf_life_hours: 72, is_active: true },
  { id: 3, name: 'Mandazi', category: 'bun', selling_price: 10, available_stock: 120, unit: 'piece', shelf_life_hours: 12, is_active: true },
  { id: 4, name: 'Cinnamon Roll', category: 'pastry', selling_price: 80, available_stock: 15, unit: 'piece', shelf_life_hours: 18, is_active: true },
  { id: 5, name: 'Meat Pie', category: 'pastry', selling_price: 120, available_stock: 20, unit: 'piece', shelf_life_hours: 20, is_active: true },
  { id: 6, name: 'Samosa', category: 'bun', selling_price: 25, available_stock: 40, unit: 'piece', shelf_life_hours: 16, is_active: true },
  { id: 7, name: 'Brownie', category: 'cake', selling_price: 90, available_stock: 5, unit: 'piece', shelf_life_hours: 72, is_active: true },
  { id: 8, name: 'Muffin', category: 'pastry', selling_price: 110, available_stock: 10, unit: 'piece', shelf_life_hours: 36, is_active: true },
])

const selectedProductId = ref(null)
const selectedPaymentMethod = ref('Cash')
const saleQuantity = ref(1)
const mpesaReference = ref('')
const formError = ref('')
const successMessage = ref('')

const salesHistory = ref([
  { id: 1, productId: 1, productName: 'White Bread', amount: 180, paymentMethod: 'Cash', cashier: 'Grace', date: '2026-06-01 09:10', reference: 'N/A' },
  { id: 2, productId: 2, productName: 'Chocolate Cake', amount: 700, paymentMethod: 'M-Pesa', cashier: 'Mark', date: '2026-06-01 11:34', reference: 'MPESA12345' },
  { id: 3, productId: 3, productName: 'Mandazi', amount: 200, paymentMethod: 'Cash', cashier: 'Faith', date: '2026-06-01 12:05', reference: 'N/A' },
  { id: 4, productId: 4, productName: 'Cinnamon Roll', amount: 320, paymentMethod: 'M-Pesa', cashier: 'Brian', date: '2026-06-01 14:20', reference: 'MPESA98765' },
  { id: 5, productId: 5, productName: 'Meat Pie', amount: 240, paymentMethod: 'Cash', cashier: 'Grace', date: '2026-06-01 15:00', reference: 'N/A' },
])

const selectedProduct = computed(() => products.value.find(p => p.id === selectedProductId.value) || null)

const totalCashRevenue = computed(() => salesHistory.value.filter(s => s.paymentMethod === 'Cash').reduce((a, b) => a + b.amount, 0))
const totalMpesaRevenue = computed(() => salesHistory.value.filter(s => s.paymentMethod === 'M-Pesa').reduce((a, b) => a + b.amount, 0))
const totalRevenue = computed(() => totalCashRevenue.value + totalMpesaRevenue.value)

const formattedTotalRevenue = computed(() => totalRevenue.value.toLocaleString())
const formattedTotalCash = computed(() => totalCashRevenue.value.toLocaleString())
const formattedTotalMpesa = computed(() => totalMpesaRevenue.value.toLocaleString())

const revenueBreakdown = computed(() => {
  const total = totalRevenue.value || 1
  return {
    cashPercent: Math.round((totalCashRevenue.value / total) * 100),
    mpesaPercent: Math.round((totalMpesaRevenue.value / total) * 100),
  }
})

const historyTitle = computed(() => selectedProduct.value ? `Sales history for ${selectedProduct.value.name}` : 'All sales history')
const historyDescription = computed(() => selectedProduct.value
  ? `Showing the latest sales records for ${selectedProduct.value.name}.`
  : 'Showing the latest sales records across all products.')

const displayedSales = computed(() => {
  if (!selectedProduct.value) return salesHistory.value.slice().reverse()
  return salesHistory.value.filter(s => s.productId === selectedProduct.value.id).slice().reverse()
})

function selectProduct(product) {
  selectedProductId.value = product.id
  selectedPaymentMethod.value = 'Cash'
  saleQuantity.value = 1
  mpesaReference.value = ''
  formError.value = ''
  successMessage.value = ''
}

function clearSelection() {
  selectedProductId.value = null
  formError.value = ''
  successMessage.value = ''
}

function validateMpesaReference(value) {
  return /^[A-Z0-9]{6,12}$/.test(value.trim().toUpperCase())
}

const isMpesaValid = computed(() => {
  if (selectedPaymentMethod.value !== 'M-Pesa') return true
  if (!mpesaReference.value) return false
  return validateMpesaReference(mpesaReference.value)
})

function submitSale() {
  formError.value = ''
  successMessage.value = ''

  if (!selectedProduct.value) { formError.value = 'Select a product before recording a sale.'; return }
  if (saleQuantity.value < 1) { formError.value = 'Quantity must be at least 1.'; return }
  if (saleQuantity.value > selectedProduct.value.available_stock) { formError.value = 'Not enough stock available.'; return }
  if (selectedPaymentMethod.value === 'M-Pesa' && !validateMpesaReference(mpesaReference.value)) { formError.value = 'M-Pesa reference must be 6-12 letters/digits.'; return }

  const amount = selectedProduct.value.selling_price * saleQuantity.value
  const reference = selectedPaymentMethod.value === 'M-Pesa' ? mpesaReference.value.trim().toUpperCase() : 'N/A'

  salesHistory.value.push({
    id: salesHistory.value.length + 1,
    productId: selectedProduct.value.id,
    productName: selectedProduct.value.name,
    amount,
    paymentMethod: selectedPaymentMethod.value,
    cashier: 'System',
    date: new Date().toLocaleString('en-GB', { hour12: false }),
    reference,
  })

  selectedProduct.value.available_stock -= saleQuantity.value
  successMessage.value = `Recorded sale of ${saleQuantity.value} ${selectedProduct.value.unit}(s) for ${selectedProduct.value.name}.`
  saleQuantity.value = 1
  mpesaReference.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row">
      <section class="md:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h1 class="text-2xl font-semibold text-[#1A1A2E]">Sales Products</h1>
            <p class="text-sm text-gray-500 mt-1">Select a product to record a sale.</p>
          </div>
          <span class="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">{{ products.length }} items</span>
        </div>

        <div class="space-y-3">
          <button class="w-full text-left rounded-2xl border border-gray-200 px-4 py-3 bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100" @click="clearSelection">View overall sales history</button>

          <div class="space-y-3">
            <button v-for="product in products" :key="product.id" @click="selectProduct(product)" class="w-full rounded-3xl border px-4 py-4 text-left transition hover:shadow-sm" :class="product.id === selectedProductId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">KES {{ product.selling_price }} / {{ product.unit }}</p>
                </div>
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="product.available_stock <= 0 ? 'bg-red-100 text-red-700' : product.available_stock <= 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">{{ product.available_stock }} in stock</span>
              </div>
              <p class="mt-3 text-xs text-gray-500">{{ product.category }} • {{ product.shelf_life_hours }}h shelf life</p>
            </button>
          </div>
        </div>
      </section>

      <section class="md:w-2/3 space-y-4">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p class="text-sm text-gray-500">Total revenue</p>
            <h2 class="mt-3 text-3xl font-semibold text-[#1A1A2E]">KES {{ formattedTotalRevenue }}</h2>
            <p class="text-sm text-gray-500 mt-2">Cash and M-Pesa sales across the store.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p class="text-sm text-gray-500">Payment breakdown</p>
            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span>Cash</span>
                <span class="font-semibold">KES {{ totalCashRevenue }}</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full bg-slate-800" :style="{ width: revenueBreakdown.cashPercent + '%' }"></div>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span>M-Pesa</span>
                <span class="font-semibold">KES {{ totalMpesaRevenue }}</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full bg-amber-500" :style="{ width: revenueBreakdown.mpesaPercent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div class="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 class="text-xl font-semibold text-[#1A1A2E]">{{ selectedProduct ? 'Record sale for ' + selectedProduct.name : 'Sales history' }}</h2>
              <p class="text-sm text-gray-500 mt-1">{{ selectedProduct ? 'Enter sale details for the selected product.' : 'Click a product on the left to record a sale, or review all recorded sales.' }}</p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{{ displayedSales.length }} recent records</span>
          </div>

          <div v-if="selectedProduct">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div class="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                <p class="text-sm text-gray-500">Available stock</p>
                <p class="mt-3 text-2xl font-semibold text-[#1A1A2E]">{{ selectedProduct.available_stock }}</p>
              </div>
              <div class="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                <p class="text-sm text-gray-500">Unit price</p>
                <p class="mt-3 text-2xl font-semibold text-[#1A1A2E]">KES {{ selectedProduct.selling_price }}</p>
              </div>
              <div class="rounded-3xl border border-gray-200 bg-slate-50 p-4">
                <p class="text-sm text-gray-500">Payment method</p>
                <p class="mt-3 text-2xl font-semibold text-[#1A1A2E]">{{ selectedPaymentMethod }}</p>
              </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
              <label class="block">
                <span class="text-sm font-medium text-slate-700">Quantity</span>
                <input type="number" min="1" v-model.number="saleQuantity" class="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>

              <label class="block">
                <span class="text-sm font-medium text-slate-700">Payment method</span>
                <select v-model="selectedPaymentMethod" class="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option>Cash</option>
                  <option>M-Pesa</option>
                </select>
              </label>
            </div>

            <div v-if="selectedPaymentMethod === 'M-Pesa'" class="mt-4">
              <label class="block">
                <span class="text-sm font-medium text-slate-700">M-Pesa reference</span>
                <input type="text" v-model="mpesaReference" placeholder="Enter transaction code" class="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
              <p v-if="mpesaReference && !isMpesaValid" class="mt-2 text-xs text-red-600">M-Pesa reference must be 6-12 uppercase letters or digits.</p>
            </div>

            <div v-if="formError" class="mt-4 rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{{ formError }}</div>
            <div v-if="successMessage" class="mt-4 rounded-3xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">{{ successMessage }}</div>

            <button @click="submitSale" :disabled="!selectedProduct || (selectedPaymentMethod === 'M-Pesa' && !isMpesaValid)" class="mt-6 inline-flex items-center justify-center rounded-3xl bg-[#1A1A2E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#E8541E] transition disabled:opacity-50 disabled:cursor-not-allowed">Record sale</button>
          </div>

          <div v-else>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
              <div class="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                    <p class="text-sm text-gray-500">Cash revenue</p>
                    <p class="mt-3 text-2xl font-semibold text-[#1A1A2E]">KES {{ formattedTotalCash }}</p>
                  </div>
                  <div class="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                    <p class="text-sm text-gray-500">M-Pesa revenue</p>
                    <p class="mt-3 text-2xl font-semibold text-[#1A1A2E]">KES {{ formattedTotalMpesa }}</p>
                  </div>
            </div>
            <div class="rounded-3xl border border-gray-200 bg-slate-50 p-5">
              <h3 class="text-base font-semibold text-[#1A1A2E]">{{ historyTitle }}</h3>
              <p class="text-sm text-gray-500 mt-2">{{ historyDescription }}</p>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <div v-for="sale in displayedSales" :key="sale.id" class="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-500">{{ sale.date }}</p>
                  <h3 class="mt-1 text-lg font-semibold text-[#1A1A2E]">{{ sale.productName }}</h3>
                </div>
                <div class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800">{{ sale.paymentMethod }}</div>
              </div>
              <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                <span>Cashier: {{ sale.cashier }}</span>
                <span>Amount: KES {{ sale.amount }}</span>
                <span>Reference: {{ sale.reference }}</span>
              </div>
            </div>
            <div v-if="displayedSales.length === 0" class="rounded-3xl border border-dashed border-gray-300 bg-slate-50 p-8 text-center text-sm text-gray-500">No sales recorded yet for {{ selectedProduct ? selectedProduct.name : 'the store' }}.</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>