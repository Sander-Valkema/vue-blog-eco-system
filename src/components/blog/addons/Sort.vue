<script setup lang="ts">

// vendor
import { ref, type Ref } from 'vue'

// models
import { 
    ASC, 
    DESC, 
    BlogItem as BlogItemInterface, 
    SortParams as SortParamsInterface, 
    SortKeyDirection as SortKeyDirectionType
} from '@/models/blog'

const { keys, sortValue } = defineProps<SortParamsInterface & {sortValue: SortKeyDirectionType}>()

/**
 * @type {const} sorts - generates a list of selectable sort options
 */
const sorts: Ref<SortKeyDirectionType[]> = ref((() => {
    return (
        keys?.reduce((acc: SortKeyDirectionType[], sortKey: keyof BlogItemInterface): SortKeyDirectionType[] => {
            return [...(acc ?? []), [sortKey, DESC], [sortKey, ASC]]
        }, []) ?? []
    )
})())

/**
 * @type {const} activeValue - currently selected sort option
 */
const activeValue: Ref<SortKeyDirectionType> = ref(sortValue ?? sorts.value[0])

const emit = defineEmits<{
    (e: 'change', sortObj: SortKeyDirectionType): void
}>()

/**
 * Event handler when new sort option is selected
 * 
 * @param {Event} event - event
 */
const onChangeHandler = (event: Event) => {
    const value = (event.target as HTMLInputElement).value.split('#') as SortKeyDirectionType
    activeValue.value = value
    emit('change', value)
}
</script>

<template>
    <div class="sort">
        <p class="title">Sort</p>
        <select
            class="sort"
            :value="activeValue.join('#')"
            @change="onChangeHandler"
        >
            <option
                v-for="sort in sorts"
                :key="sort.join('#')"
                :value="sort.join('#')"
            >
                {{ sort.join(' - ') }}
            </option>
        </select>
    </div>
</template>

<style lang="scss" scoped>
@use '/src/styling/breakpoints.scss' as b;

.sort {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    width: 100%;

    @include b.md {
        width: unset;
    }

    p.title {
        margin: 0;
        left: 0;
    }

    select {
        height: 2rem;
        border-radius: 60rem;
        padding: 0 0.5rem 0 0.7rem;
        cursor: pointer;
        width: 100%;

        @include b.md {
            width: unset;
        }
    }
}
</style>
