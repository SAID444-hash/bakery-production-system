// ---------------------------------------------------------------
// PINIA STORE: Sales records and sales summary
//
// This store is used by the SalesView and eventually by any
// component that needs sales history, revenue, or payment metrics.
// ---------------------------------------------------------------

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSalesStore = defineStore('sales', () => {
  const sales = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const salesCount = computed(() => sales.value.length)

  const totalRevenue = computed(() => {
    return sales.value.reduce((sum, sale) => sum + sale.total_amount, 0)
  })

  const paymentSummary = computed(() => {
    return sales.value.reduce((summary, sale) => {
      const method = sale.payment_method || 'unknown'
      summary[method] = (summary[method] || 0) + sale.total_amount
      return summary
    }, {})
  })

  const lastSale = computed(() => {
    return sales.value[sales.value.length - 1] || null
  })

  function addSale(sale) {
    sales.value.push(sale)
  }

  function recordSale({ product, quantity = 1, payment_method = 'cash', mpesa_ref = null }) {
    const id = sales.value.length + 1
    const total_amount = product.selling_price * quantity
    const timestamp = new Date().toISOString()

    const newSale = {
      id,
      product_id: product.id,
      product_name: product.name,
      quantity,
      total_amount,
      payment_method,
      mpesa_ref: payment_method === 'mpesa' ? mpesa_ref : null,
      timestamp,
    }

    addSale(newSale)
    return newSale
  }

  function clearSales() {
    sales.value = []
  }

  function setError(message) {
    error.value = message
  }

  return {
    sales,
    isLoading,
    error,
    salesCount,
    totalRevenue,
    paymentSummary,
    lastSale,
    addSale,
    recordSale,
    clearSales,
    setError,
  }
})
