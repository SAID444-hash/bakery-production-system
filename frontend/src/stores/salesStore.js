import { defineStore } from 'pinia'

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalSales: (state) => {
      return state.sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0)
    },

    salesCount: (state) => state.sales.length,
  },

  actions: {
    addSale(sale) {
      this.sales.push({
        id: Date.now(),
        ...sale,
        createdAt: new Date(),
      })
    },

    removeSale(id) {
      this.sales = this.sales.filter((sale) => sale.id !== id)
    },

    updateSale(id, updatedData) {
      const index = this.sales.findIndex((sale) => sale.id === id)
      if (index !== -1) {
        this.sales[index] = {
          ...this.sales[index],
          ...updatedData,
        }
      }
    },

    clearSales() {
      this.sales = []
    },
  },
})