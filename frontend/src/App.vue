<script setup>
import { ref, computed } from 'vue'

const products = ref([
  { id: 1, name: 'Bread', prices: 60, category: 'Bakery', shelf_life: 24 },
  { id: 2, name: 'Cake', prices: 150, category: 'Bakery', shelf_life: 48 },
  { id: 3, name: 'Pastry', prices: 100, category: 'Bakery', shelf_life: 36 },
  { id: 4, name: 'Donut', prices: 80, category: 'Bakery', shelf_life: 12 },
  { id: 5, name: 'Muffin', prices: 120, category: 'Bakery', shelf_life: 30 },
  { id: 6, name: 'Croissant', prices: 200, category: 'Bakery', shelf_life: 20 },
])

const searchTerm = ref('')

const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)
</script>

<template>
  <h1>Bakery Production System</h1>

  <!-- Search input -->
  <input v-model="searchTerm" placeholder="Search products..." />

  <!-- Product list -->
  <div v-for="product in filteredProducts" :key="product.id">
    <h2>{{ product.name }}</h2>
    <p :style="{ color: product.prices > 100 ? 'green' : 'black' }">
      Price: {{ product.prices }}
    </p>
    <p>Category: {{ product.category }}</p>
    <p>Shelf Life: {{ product.shelf_life }} hours</p>
  </div>
</template>

<style scoped>
input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 200px;
}
</style>
