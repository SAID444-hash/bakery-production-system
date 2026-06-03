<script setup>
import { ref, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productStore'


const productStore = useProductStore()


const searchQuery = ref('')
const selectedCategory = ref('all')

const newProduct = ref({
  name: '',
  category: '',
  selling_price: null,
  shelf_life_hours: null,
  unit: ''
})

const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'all' || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

function submitProduct() {
  if (!newProduct.value.name || !newProduct.value.category || !newProduct.value.selling_price || !newProduct.value.shelf_life_hours || !newProduct.value.unit) {
    alert('Please fill in every product field before adding.')
    return
  }

  productStore.addProduct({
    name: newProduct.value.name.trim(),
    category: newProduct.value.category,
    selling_price: Number(newProduct.value.selling_price),
    shelf_life_hours: Number(newProduct.value.shelf_life_hours),
    unit: newProduct.value.unit.trim(),
    is_active: true
  })

  newProduct.value = {
    name: '',
    category: '',
    selling_price: null,
    shelf_life_hours: null,
    unit: ''
  }
}

function handleDeleteProduct(productId) {
  productStore.deleteProduct(productId)
}

function handleToggleActive(productId) {
  productStore.toggleActive(productId)
}

function handleSale(product) {
  alert(`Sale: ${product.name} for KES ${product.selling_price}`)
}

function handleViewRecipe(productId) {
  alert(`View recipe for product #${productId}`)
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[#1A1A2E]">Product Catalog</h1>
      <p class="text-gray-500 text-sm mt-1">
        {{ filteredProducts.length }} of {{ productStore.products.length }} products ({{ productStore.activeProducts.length }} active)
      </p>
    </div>

    <!-- Add product form -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-6">
      <h2 class="text-lg font-semibold text-[#1A1A2E] mb-4">Add Product</h2>
      <div class="grid gap-4 lg:grid-cols-3">
        <label class="block">
          <span class="text-sm text-slate-700">Name</span>
          <input v-model="newProduct.name" type="text" placeholder="Product name" class="mt-2 w-full rounded-3xl border border-gray-300 px-4 py-3 text-sm focus:border-[#1A1A2E] focus:ring-2 focus:ring-orange-100" />
        </label>
        <label class="block">
          <span class="text-sm text-slate-700">Category</span>
          <select v-model="newProduct.category" class="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#1A1A2E] focus:ring-2 focus:ring-orange-100">
            <option value="" disabled>Select category</option>
            <option v-for="cat in productStore.categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </label>
        <label class="block">
          <span class="text-sm text-slate-700">Unit</span>
          <input v-model="newProduct.unit" type="text" placeholder="e.g. loaf" class="mt-2 w-full rounded-3xl border border-gray-300 px-4 py-3 text-sm focus:border-[#1A1A2E] focus:ring-2 focus:ring-orange-100" />
        </label>
        <label class="block">
          <span class="text-sm text-slate-700">Selling price</span>
          <input v-model.number="newProduct.selling_price" type="number" min="1" placeholder="KES" class="mt-2 w-full rounded-3xl border border-gray-300 px-4 py-3 text-sm focus:border-[#1A1A2E] focus:ring-2 focus:ring-orange-100" />
        </label>
        <label class="block">
          <span class="text-sm text-slate-700">Shelf life (hours)</span>
          <input v-model.number="newProduct.shelf_life_hours" type="number" min="1" placeholder="Hours" class="mt-2 w-full rounded-3xl border border-gray-300 px-4 py-3 text-sm focus:border-[#1A1A2E] focus:ring-2 focus:ring-orange-100" />
        </label>
        <div class="flex items-end">
          <button @click="submitProduct" class="w-full rounded-3xl bg-[#1A1A2E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#E8541E] transition">Add Product</button>
        </div>
      </div>
    </div>

    <!-- Search + filter -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div class="relative w-full sm:max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
                 focus:outline-none focus:border-[#E8541E] focus:ring-2 focus:ring-orange-100 transition"
        >
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in productStore.categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="px-3.5 py-1.5 rounded-full text-sm font-medium capitalize border transition-colors"
          :class="selectedCategory === cat
            ? 'bg-[#1A1A2E] text-white border-[#1A1A2E]'
            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'"
        >
          {{ cat === 'all' ? 'All' : cat }}
        </button>
      </div>
    </div>

    <!-- Product grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :show-controls="true"
        @delete-product="handleDeleteProduct"
        @toggle-active="handleToggleActive"
        @sell-product="handleSale"
        @view-recipe="handleViewRecipe"
      />
    </div>

    <!-- Empty state -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12 text-gray-400">
      No products match your search. Try a different term or category.
    </div>
  </div>
</template>