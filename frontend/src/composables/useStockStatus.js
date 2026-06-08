// ---------------------------------------------------------------
// COMPOSABLE: reusable stock status logic
//
// Used by: StockIndicator, BatchPlanningForm, PurchaseOrderView
// ---------------------------------------------------------------

import { computed } from 'vue'

export function useStockStatus(currentStock, reorderLevel) {

    // ----------------------------
    // Safe values
    // ----------------------------
    const safeStock = computed(() => Math.max(currentStock.value || 0, 0))
    const safeReorder = computed(() => Math.max(reorderLevel.value || 1, 1))

    const thresholds = computed(() => ({
        danger: safeReorder.value,
        warning: safeReorder.value * 2,
        healthy: safeReorder.value * 3
    }))

    // ----------------------------
    // Status logic
    // ----------------------------
    const status = computed(() => {
        if (safeStock.value <= 0) return 'empty'
        if (safeStock.value < thresholds.value.danger) return 'danger'
        if (safeStock.value < thresholds.value.warning) return 'warning'
        return 'healthy'
    })

    const statusLabel = computed(() => {
        const labels = {
            empty: 'OUT OF STOCK',
            danger: 'Below reorder',
            warning: 'Getting low',
            healthy: 'Good'
        }
        return labels[status.value] ?? 'Unknown'
    })

    // ----------------------------
    // Style maps (single source of truth)
    // ----------------------------
    const styles = {
        empty: {
            text: 'text-red-600',
            bg: 'bg-red-500',
            border: 'border-red-500'
        },
        danger: {
            text: 'text-red-600',
            bg: 'bg-red-500',
            border: 'border-red-500'
        },
        warning: {
            text: 'text-amber-600',
            bg: 'bg-amber-500',
            border: 'border-amber-500'
        },
        healthy: {
            text: 'text-emerald-600',
            bg: 'bg-emerald-500',
            border: 'border-emerald-500'
        }
    }

    const statusColor = computed(() => styles[status.value].text)
    const barColor = computed(() => styles[status.value].bg)
    const borderColor = computed(() => styles[status.value].border)

    // ----------------------------
    // Business logic
    // ----------------------------
    const needsReorder = computed(() =>
        safeStock.value < safeReorder.value
    )

    const barWidth = computed(() => {
        const max = safeReorder.value * 3
        if (max === 0) return 0
        return Math.min((safeStock.value / max) * 100, 100)
    })

    // ----------------------------
    // Return API
    // ----------------------------
    return {
        status,
        statusLabel,
        statusColor,
        barColor,
        borderColor,
        needsReorder,
        barWidth
    }
}