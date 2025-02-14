<script setup lang="ts">
// vendor
import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
import { RouterLink, useRoute, type LocationQuery } from 'vue-router'
import router from '@/router'

// store
import { useFilterStore } from '@/stores/filter'

// hooks
import { encodeStringToUrl } from '@/hooks/use-url-parser'

// models
import {
    ASC,
    DESC,
    BlogItem as BlogItemInterface,
    BlogList as BlogListInterface,
    Filter as FilterInterface,
    SortKeyDirection as SortKeyDirectionType,
} from '@/models/blog'

// components
import Pagination from '@/components/blog/addons/Pagination.vue'
import Sort from '@/components/blog/addons/Sort.vue'
import Tags from '@/components/blog/addons/Tags.vue'
import Search from '@/components/blog/addons/Search.vue'

// icons/images
import ErrorWarningLineIcon from '@/assets/icons/error-warning-line.svg?component'

// constants
const filterStore = useFilterStore()
const route = useRoute()

/**
 * Props
 */
const {
    blogData,
    className,
    colMobile = 1,
    colTablet = 2,
    colDesktop = 3,
    tags = {
        show: true,
        max: 7,
    },
    search = {
        show: true,
        debounceTime: 150,
    },
    pagination = {
        show: true,
        showNextPrev: true,
        showFirstLast: true,
        maxItemsPerPage: 6,
        maxPageNumbers: 3,
    },
    sort = {
        show: true,
        keys: ['date', 'title'],
    },
    showResults = true,
} = defineProps<BlogListInterface>()

/**
 * page, tags, sort and search filter initialization and declaration
 */
const decodedQuery: Ref<LocationQuery | undefined> = ref(filterStore?.getFilter ?? route.query)
const pageValue: Ref<number> = ref(parseInt((decodedQuery.value?.page ?? '1') as string, 10))
const sortValue: Ref<SortKeyDirectionType> = ref((decodedQuery.value?.sort ?? ['title', DESC]) as SortKeyDirectionType)
const searchValue: Ref<string> = ref((decodedQuery.value?.search ?? '') as string)
const tagsValue: Ref<string[]> = ref((decodedQuery.value?.tags ?? []) as string[])

/**
 * @type {const} filteredBlogs - blogs filtered by tags, sort and search component
 */
const filteredBlogs: ComputedRef<BlogItemInterface[]> = computed(() => {
    let fBlogs: BlogItemInterface[] = [...blogData]

    // tags filter
    if (tagsValue.value && tagsValue.value.length !== 0) {
        fBlogs = fBlogs.filter((blog: BlogItemInterface) => (blog?.tags ?? []).some((tag: string) => tagsValue.value.includes(tag)))
    }

    // sort filter
    if (sortValue.value && sort.keys && sort.keys.length > 0) {
        const [sKeys, sDirection] = sortValue.value
        fBlogs = fBlogs.sort((a: BlogItemInterface, b: BlogItemInterface) => {
            const firstItem: any = a[sKeys as keyof BlogItemInterface]
            const secondItem: any = b[sKeys as keyof BlogItemInterface]

            if (isNaN(firstItem) && isNaN(secondItem)) {
                return sDirection === ASC ? firstItem.localeCompare(secondItem) : secondItem.localeCompare(firstItem)
            }

            return sDirection === ASC ? firstItem - secondItem : secondItem - firstItem
        })
    }

    // search filter
    if (searchValue.value && searchValue.value !== '') {
        fBlogs = fBlogs.filter((blog: BlogItemInterface) => {
            return Object.values(blog).some((blogValue: any) => {
                if (!isNaN(blogValue)) return false

                return blogValue.toString().toLowerCase().includes(searchValue.value)
            })
        })
    }

    return fBlogs
})

/**
 * @type {const} totalFilteredBlogs - total filtered blogs
 */
const totalFilteredBlogs: ComputedRef<number> = computed(() => filteredBlogs.value.length)

/**
 * @type {const} paginatedBlogs - blogs filtered by selected page
 */
const paginatedBlogs: ComputedRef<BlogItemInterface[]> = computed(() => {
    if (!pagination.show || !pageValue.value || pagination.maxItemsPerPage === 0 || totalFilteredBlogs.value === 0) return filteredBlogs.value

    const max: number = pageValue.value * pagination.maxItemsPerPage
    const min: number = max - pagination.maxItemsPerPage

    return filteredBlogs.value.filter((blog: BlogItemInterface, index: number) => index >= min && index < max)
})

/**
 * Update and initialize the url query parameters from component filters
 */
watch(
    () => {
        return {
            sort: sortValue.value,
            search: searchValue.value,
            tags: tagsValue.value,
            page: pageValue.value,
        }
    },
    (filter: FilterInterface) => {
        filterStore.setFilter(filter as LocationQuery)
        router.replace({
            name: 'blog',
            query: filter as LocationQuery,
        })
    },
    { immediate: true }
)

/**
 * Event handler when tags are clicked
 *
 * @param {string[]} value - tags
 */
const onTagsHandler = (value: string[]): void => {
    tagsValue.value = value
    pageValue.value = 1
}

/**
 * Event handler when pagination buttons are clicked
 *
 * @param {number} value - clicked page number
 */
const onPaginationHandler = (value: number): void => {
    pageValue.value = value
}

/**
 * Event handler when search field is updated
 *
 * @param {string} value - search word
 */
const onSearchHandler = (value: string): void => {
    searchValue.value = value
    pageValue.value = 1
}

/**
 * Event handler when sort option is selected
 *
 * @param {sortKeyDirectionType} value - sort object
 */
const onSortHandler = (value: SortKeyDirectionType): void => {
    sortValue.value = value
    pageValue.value = 1
}
</script>

<template>
    <div :class="['blog-list', `blog-list--col-mobile-${colMobile}`, `blog-list--col-tablet-${colTablet}`, `blog-list--col-desktop-${colDesktop}`, className ?? '']">
        <div class="top-filters">
            <Search
                v-if="search.show"
                :searchValue="searchValue"
                v-bind="search"
                @change="onSearchHandler"
            />
            <Sort
                v-if="sort.show && sort.keys"
                :sortValue="sortValue"
                v-bind="sort"
                @change="onSortHandler"
            />
        </div>
        <Tags
            v-if="tags.show"
            :blog-data="blogData"
            :tagsValue="tagsValue"
            v-bind="tags"
            @change="onTagsHandler"
        />
        <template v-if="totalFilteredBlogs > 0">
            <div class="list">
                <template
                    v-for="blog in paginatedBlogs"
                    :key="blog.id"
                >
                    <RouterLink :to="`/blog/${blog.id}/${encodeStringToUrl(blog.title)}`">
                        <slot :blog="blog"></slot>
                    </RouterLink>
                </template>
            </div>
            <p
                v-if="showResults"
                class="results"
            >
                results: {{ totalFilteredBlogs }}
            </p>
        </template>
        <div
            v-else
            class="no-blogs-found"
        >
            <ErrorWarningLineIcon
                alt="exclamation mark"
                width="22"
                height="22"
            />
            <p>Sorry, no blogs where found.</p>
        </div>
        <Pagination
            v-if="pagination.show"
            :total-items="totalFilteredBlogs"
            :pageValue="pageValue"
            v-bind="pagination"
            @change="onPaginationHandler"
        ></Pagination>
    </div>
</template>

<style lang="scss" scoped>
@use '/src/styling/breakpoints.scss' as b;

.blog-list {
    a {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }

    .list {
        display: grid;
        gap: 1rem;
    }

    .results {
        user-select: none;
        margin-bottom: 0;
        font-size: 0.8rem;
    }

    .top-filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem 0;

        @include b.md {
            flex-direction: row;
        }
    }

    .no-blogs-found {
        display: flex;
        gap: 0.3rem;
        margin-top: 2rem;
        align-items: center;
        justify-content: center;
        color: white;
        background: var(--color-error);
        box-shadow: var(--box-shadow-default);
        padding: 0.3rem 1rem;
        border-radius: 0.6rem;
    }

    @for $i from 1 through 3 {
        &--col-mobile-#{$i} .list {
            grid-template-columns: repeat($i, minmax(0, 1fr));
        }
    }

    @include b.md {
        @for $i from 1 through 3 {
            &--col-tablet-#{$i} .list {
                grid-template-columns: repeat($i, minmax(0, 1fr));
            }
        }
    }

    @include b.lg {
        @for $i from 1 through 3 {
            &--col-desktop-#{$i} .list {
                grid-template-columns: repeat($i, minmax(0, 1fr));
            }
        }
    }
}
</style>
