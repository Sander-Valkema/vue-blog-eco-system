<script setup lang="ts">

// vendor
import { ref, watch, type Ref } from 'vue'

// icons/images
import CloseLineIcon from '@/assets/icons/close-line.svg?component'
import SearchLineIcon from '@/assets/icons/search-line.svg?component'

// models
import { SearchParams as SearchParamsInterface } from '@/models/blog'

// constants
const { debounceTime, searchValue } = defineProps<SearchParamsInterface & {searchValue: string}>()
const timeOutFunction: Ref<NodeJS.Timeout | undefined> = ref()
const searchText: Ref<string> = ref(searchValue)

// custom events
const emit = defineEmits<{
    (e: 'change', search: string): void
}>()

/**
 * Debouncer. Prevents request overload when searchText is updated
 * 
 * @param {function} func - the triggered function when debounce has ended
 * @param {number} time     - debounce delay time 
 */
const debounce = (func: () => void, time: number = 150): void => {
    window.clearTimeout(timeOutFunction.value)
    timeOutFunction.value = window.setTimeout(() => {
        func()
    }, time) as any
}

/**
 * Event handler when search input field is updated
 * 
 * @param {Event} event - event
 */
const onInputHandler = (event: Event) => {
    const el = event.target as HTMLInputElement
    searchText.value = el.value
    debounce(() => emit('change', el.value), debounceTime)
}

/**
 * Event handler when search input field is cleared of text
 */
 const onClickHandler = () => {
    searchText.value = ''
    emit('change', '')
}
</script>

<template>
    <div class="search">
        <SearchLineIcon
            class="search-icon"
            width="16"
            height="16"
            alt="magnifier"
        />
        <input
            placeholder="Search"
            type="text"
            :value="searchText"
            @input="onInputHandler"
        />
        <button
            v-show="searchText && searchText != ''"
            type="button"
            @click="onClickHandler"
        >
            <CloseLineIcon
                width="18"
                height="18"
                alt="X"
            />
        </button>
    </div>
</template>

<style lang="scss" scoped>
@use '/src/styling/breakpoints.scss' as b;

.search {
    display: flex;
    gap: 1rem;
    position: relative;
    width: 100%;
    
    @include b.md {
        width: unset;
    }

    input {
        height: 2rem;
        border-radius: 60rem;
        padding-left: 2rem;
        padding-right: 2rem;
        width: 100%;
    }

    .search-icon,
    button {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        display: block;
    }

    .search-icon {
        left: 0.4rem;
    }

    button {
        right: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
