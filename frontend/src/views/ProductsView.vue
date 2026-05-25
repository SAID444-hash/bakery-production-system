<script setup>
// fetching all products from the backend
import { ref, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'

// ---------------------------------------------------------------
// PRODUCTS DATA
// ---------------------------------------------------------------
const products = ref([
  {
    id: 1,
    name: 'White Bread',
    category: 'bread',
    selling_price: 60,
    shelf_life_hours: 24,
    unit: 'loaf',
    is_active: true
  },
  {
    id: 2,
    name: 'Chocolate Cake',
    category: 'cake',
    selling_price: 350,
    shelf_life_hours: 72,
    unit: 'piece',
    is_active: true
  },
  {
    id: 3,
    name: 'Mandazi',
    category: 'bun',
    selling_price: 10,
    shelf_life_hours: 12,
    unit: 'piece',
    is_active: true
  },

  // Added Products
  {
    id: 4,
    name: 'Brown Bread',
    category: 'bread',
    selling_price: 65,
    shelf_life_hours: 24,
    unit: 'loaf',
    is_active: true
  },
  {
    id: 5,
    name: 'Cinnamon Roll',
    category: 'pastry',
    selling_price: 40,
    shelf_life_hours: 12,
    unit: 'piece',
    is_active: true
  },
  {
    id: 6,
    name: 'Meat Pie',
    category: 'pastry',
    selling_price: 80,
    shelf_life_hours: 8,
    unit: 'piece',
    is_active: true
  },
  {
    id: 7,
    name: 'Chapati',
    category: 'bread',
    selling_price: 20,
    shelf_life_hours: 8,
    unit: 'piece',
    is_active: true
  }
])

// ---------------------------------------------------------------
// SEARCH + FILTERS
// ---------------------------------------------------------------
const searchQuery = ref('')
const selectedCategory = ref('all')
const showInactive = ref(true)

// ---------------------------------------------------------------
// SALE PANEL
// ---------------------------------------------------------------
const selectedProduct = ref(null)
const quantity = ref(1)

const totalPrice = computed(() => {
  if (!selectedProduct.value) return 0
  return selectedProduct.value.selling_price * quantity.value
})

// ---------------------------------------------------------------
// SHELF LIFE COUNTERS
// ---------------------------------------------------------------
const urgentCount = computed(() =>
  products.value.filter(p => p.shelf_life_hours <= 12).length
)

const fastSellerCount = computed(() =>
  products.value.filter(
    p => p.shelf_life_hours > 12 && p.shelf_life_hours <= 48
  ).length
)

const longShelfLifeCount = computed(() =>
  products.value.filter(p => p.shelf_life_hours > 48).length
)

// ---------------------------------------------------------------
// COMPUTED VALUES
// ---------------------------------------------------------------
const categories = computed(() => {
  const cats = [...new Set(products.value.map(p => p.category))]
  return ['all', ...cats.sort()]
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === 'all' ||
      product.category === selectedCategory.value

    const matchesActive =
      showInactive.value || product.is_active

    return matchesSearch && matchesCategory && matchesActive
  })
})

const activeCount = computed(() =>
  products.value.filter(p => p.is_active).length
)

// ---------------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------------
function handleSale(product) {
  if (!product.is_active) return

  selectedProduct.value = product
  quantity.value = 1
}

function confirmSale() {
  alert(
    `Sale Confirmed!\n` +
    `${selectedProduct.value.name}\n` +
    `Quantity: ${quantity.value}\n` +
    `Total: KES ${totalPrice.value}`
  )

  selectedProduct.value = null
}

function handleViewRecipe(productId) {
  alert(`View recipe for product #${productId}`)
}

function toggleActive(product) {
  product.is_active = !product.is_active
}
</script>

<template>
  <div class="products-page">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1>Product Catalog</h1>

        <p class="subtitle">
          {{ filteredProducts.length }} of {{ products.length }} products
          ({{ activeCount }} active)
        </p>

        <!-- Shelf Life Summary -->
        <div class="shelf-summary">
          🔴 {{ urgentCount }} urgent |
          🟡 {{ fastSellerCount }} fast sellers |
          🟢 {{ longShelfLifeCount }} long shelf life
        </div>
      </div>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="filter-bar">

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="search-input"
      >

      <select
        v-model="selectedCategory"
        class="filter-select"
      >
        <option
          v-for="cat in categories"
          :key="cat"
          :value="cat"
        >
          {{ cat === 'all' ? 'All categories' : cat }}
        </option>
      </select>

      <!-- Show inactive filter -->
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="showInactive"
        >
        Show inactive products
      </label>
    </div>

    <!-- PRODUCT GRID -->
    <div class="product-grid">

      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-wrapper"
        :class="{ inactive: !product.is_active }"
      >

        <!-- Toggle Active Button -->
        <button
          class="toggle-btn"
          @click="toggleActive(product)"
        >
          {{ product.is_active ? 'Deactivate' : 'Activate' }}
        </button>

        <!-- Product Card -->
        <ProductCard
          :product="product"
          @sell-product="handleSale"
          @view-recipe="handleViewRecipe"
        />

        <!-- Shelf Life Badges -->
        <div class="badge-container">

          <span
            v-if="product.shelf_life_hours <= 12"
            class="badge urgent"
          >
            Urgent Sale
          </span>

          <span
            v-else-if="product.shelf_life_hours <= 48"
            class="badge fast"
          >
            Fast Seller
          </span>

          <span
            v-else
            class="badge long"
          >
            Long Shelf Life
          </span>
        </div>

        <!-- Disabled Overlay -->
        <div
          v-if="!product.is_active"
          class="inactive-label"
        >
          Inactive Product
        </div>

      </div>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-if="filteredProducts.length === 0"
      class="empty-state"
    >
      <p>
        No products match your search.
        Try a different term or category.
      </p>
    </div>

    <!-- SALE CONFIRMATION PANEL -->
    <div
      v-if="selectedProduct"
      class="sale-panel"
    >
      <h2>Confirm Sale</h2>

      <p>
        <strong>Product:</strong>
        {{ selectedProduct.name }}
      </p>

      <p>
        <strong>Price:</strong>
        KES {{ selectedProduct.selling_price }}
      </p>

      <div class="quantity-box">
        <label>Quantity:</label>

        <input
          type="number"
          min="1"
          v-model="quantity"
        >
      </div>

      <p class="total">
        Total: KES {{ totalPrice }}
      </p>

      <button
        class="confirm-btn"
        @click="confirmSale"
      >
        Confirm Sale
      </button>
    </div>

  </div>
</template>

<style scoped>
.products-page {
  max-width: 1100px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  color: #1A1A2E;
  margin: 0;
}

.subtitle {
  color: #6B7280;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.shelf-summary {
  margin-top: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.filter-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: 10px 14px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
}

.search-input:focus {
  border-color: #2563EB;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  text-transform: capitalize;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.product-wrapper {
  position: relative;
  transition: 0.3s;
}

.product-wrapper.inactive {
  opacity: 0.5;
}

.toggle-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  border: none;
  background: #374151;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.toggle-btn:hover {
  background: #111827;
}

.badge-container {
  margin-top: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.urgent {
  background: #DC2626;
}

.fast {
  background: #F59E0B;
}

.long {
  background: #16A34A;
}

.inactive-label {
  margin-top: 0.5rem;
  color: #DC2626;
  font-size: 0.85rem;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9CA3AF;
  font-size: 1rem;
}

/* SALE PANEL */
.sale-panel {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.sale-panel h2 {
  margin-bottom: 1rem;
  color: #1A1A2E;
}

.quantity-box {
  margin: 1rem 0;
}

.quantity-box input {
  width: 100px;
  padding: 8px;
  margin-left: 0.5rem;
}

.total {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.confirm-btn {
  background: #E8541E;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.confirm-btn:hover {
  background: #c94516;
}
</style>