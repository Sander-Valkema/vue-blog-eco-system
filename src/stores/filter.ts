// vendor
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import { type LocationQuery, type RouteLocation } from 'vue-router'

// models
interface ThemeParams {
    to: Ref<RouteLocation | undefined>
    setFilter: (filter: LocationQuery) => void,
    getFilter: ComputedRef<LocationQuery | undefined>
}

/**
 * Restores the previously used filters when switching between pages.
 */
export const useFilterStore = defineStore<string, ThemeParams>('filter', () => {
    const to: Ref<RouteLocation | undefined> = ref()
    const filterData: Ref<Record<string, LocationQuery>> = ref({})

    /**
     * Set filter
     * 
     * @param {LocationQuery} filter - filters
     */
    const setFilter = ((filter: LocationQuery): void => {
        if (to.value?.name) filterData.value[to.value.name.toString()] = filter
    })

    /**
     * Get filter
     */
    const getFilter: ComputedRef<LocationQuery | undefined> = computed(() => {
        if (!to.value?.name) return undefined

        return filterData.value?.[to.value.name.toString()]
    })

    return {
        to,
        setFilter,
        getFilter
    }
});
