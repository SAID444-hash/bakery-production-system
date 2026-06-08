// ---------------------------------------------------------------
// COMPOSABLE: batch yield calculation
//
// Used by: BatchCard, DashboardView stats, ReportsView
//
// Rule:
// Yield rate = (actual / planned) × 100
// Below 80% => low yield flag
// ---------------------------------------------------------------

import { computed } from 'vue'

export function useYieldCalculation(plannedQty, actualQty) {

    // ----------------------------
    // Safe values
    // ----------------------------
    const planned = computed(() => Math.max(plannedQty?.value || 0, 0))
    const actual = computed(() => Math.max(actualQty?.value || 0, 0))

    // ----------------------------
    // Yield rate
    // ----------------------------
    const yieldRate = computed(() => {
        if (planned.value === 0) return null
        return Math.round((actual.value / planned.value) * 100)
    })

    // ----------------------------
    // Status logic
    // ----------------------------
    const yieldStatus = computed(() => {
        if (yieldRate.value === null) return null

        if (yieldRate.value >= 90) {
            return {
                label: 'Excellent',
                class: 'bg-emerald-50 text-emerald-700'
            }
        }

        if (yieldRate.value >= 80) {
            return {
                label: 'Acceptable',
                class: 'bg-orange-50 text-orange-700'
            }
        }

        return {
            label: 'Low yield — review needed',
            class: 'bg-red-50 text-red-700'
        }
    })

    // ----------------------------
    // Business flag
    // ----------------------------
    const isLowYield = computed(() =>
        yieldRate.value !== null && yieldRate.value < 80
    )

    // ----------------------------
    // Return API
    // ----------------------------
    return {
        yieldRate,
        yieldStatus,
        isLowYield
    }
}