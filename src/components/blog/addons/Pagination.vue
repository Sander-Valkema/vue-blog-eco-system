<script setup lang="ts">
// vendor
import { ref, watch, computed, type Ref, type ComputedRef } from 'vue'

// images/icons
import ArrowLeftDoubleLineIcon from '@/assets/icons/arrow-left-double-line.svg?component'
import ArrowLeftSLineIcon from '@/assets/icons/arrow-left-s-line.svg?component'
import ArrowRightDoubleLineIcon from '@/assets/icons/arrow-right-double-line.svg?component'
import ArrowRightSLineIcon from '@/assets/icons/arrow-right-s-line.svg?component'

// models
import { PaginationParams as PaginationParamsInterface, paginationData as paginationDataInterface } from '@/models/blog'

// hooks
import { getArrayRange } from '@/hooks/use-generic'

// constants
const {
    totalItems,
    maxItemsPerPage,
    pageValue,
    maxPageNumbers,
    showNextPrev,
    showFirstLast,
} = defineProps<PaginationParamsInterface & { pageValue: number, totalItems: number }>()

const page: Ref<number> = ref(pageValue)
const totalPages: ComputedRef<number> = computed(() => Math.ceil(totalItems / maxItemsPerPage))

// custom events
const emit = defineEmits<{
    (e: 'change', page: number): void
}>()

/**
 * @type {const} pagination Data - Calculate the pagination position and range when new page is selected
 */
const paginationData: ComputedRef<paginationDataInterface> = computed(() => {
    // when max pages does not exceed the allowed max page numbers
    if (maxPageNumbers >= totalPages.value) {
        return {
            pageRange: getArrayRange(1, totalPages.value),
            pos: 'none',
        }
    }

    // at the start of the pagination
    if (page.value - Math.ceil(maxPageNumbers / 2) <= 0) {
        return {
            pageRange: getArrayRange(1, maxPageNumbers),
            pos: page.value === 1 ? 'first' : 'at start',
        }
    }

    // at the end of the pagination
    if (page.value + Math.floor(maxPageNumbers / 2) >= totalPages.value) {
        return {
            pageRange: getArrayRange(totalPages.value - maxPageNumbers + 1, totalPages.value),
            pos: page.value === totalPages.value ? 'last' : 'at end',
        }
    }

    return {
        pageRange: getArrayRange(page.value - Math.floor(maxPageNumbers / 2), page.value + Math.floor(maxPageNumbers / 2)),
        pos: 'middle',
    }
})

watch(page, (pg: number) => {
    emit('change', pg)
})

watch(() => pageValue, (pg: number) => {
    page.value = pg
})

/**
 * Event handler when page buttons are clicked
 *
 * @param {number} pg - page number
 */
const onClickPageHandler = (pg: number): void => {
    page.value = pg
}
</script>

<template>
    <ul
        v-if="totalPages !== 1"
        class="pagination"
    >
        <li
            v-if="showFirstLast"
            :class="['first-last', { hidden: ['first', 'at start', 'none'].includes(paginationData?.pos) }]"
            @click="onClickPageHandler(1)"
        >
            <ArrowLeftDoubleLineIcon
                alt="double left arrows"
                height="18"
                width="18"
            />
        </li>
        <li
            v-if="showNextPrev"
            :class="['next-prev', { hidden: ['first', 'none'].includes(paginationData?.pos) }]"
            @click="onClickPageHandler(page - 1)"
        >
            <ArrowLeftSLineIcon
                alt="single left arrow"
                height="18"
                width="18"
            />
        </li>
        <li
            v-for="pg in paginationData?.pageRange ?? []"
            :key="pg"
            :class="['page', { 'page--active': pg === page }]"
            @click="onClickPageHandler(pg)"
        >
            {{ pg }}
        </li>
        <li
            v-if="showNextPrev"
            :class="['next-prev', { hidden: ['last', 'none'].includes(paginationData?.pos) }]"
            @click="onClickPageHandler(page + 1)"
        >
            <ArrowRightSLineIcon
                alt="single right arrow"
                height="18"
                width="18"
            />
        </li>
        <li
            v-if="showFirstLast"
            :class="['first-last', { hidden: ['last', 'at end', 'none'].includes(paginationData?.pos) }]"
            @click="onClickPageHandler(totalPages)"
        >
            <ArrowRightDoubleLineIcon
                alt="double right arrows"
                height="18"
                width="18"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.theme.theme--light .pagination {
    .page,
    .first-last,
    .next-prev {
        border: 1px solid var(--color-light-border);
    }

    .page--active {
        color: white;
        background-color: black;
        border: 1px solid black;
    }
}

.theme.theme--dark .pagination {
    .page,
    .first-last,
    .next-prev {
        border: 1px solid var(--color-dark-border);
    }

    .page--active {
        color: black;
        background-color: white;
        border: 1px solid white;
    }
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
    gap: 0.5rem;

    .page,
    .first-last,
    .next-prev {
        user-select: none;
        width: 2rem;
        height: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        font-size: 1.2rem;
        cursor: pointer;
    }

    .page--active {
        font-weight: 600;
    }

    .hidden {
        visibility: hidden;
    }

    .active {
        background: black;
        color: white;
        border-color: black;
    }
}
</style>
