<script setup lang="ts">

// vendor
import { ref, watch, type Ref } from 'vue'

// icons/images
import CloseLineIcon from '@/assets/icons/close-line.svg?component'

// models
import { BlogItem as BlogItemInterface, TagsParams as TagsParamsInterface } from '@/models/blog'
type counterType = { tag: string; occurence: number }

const { blogData, tagsValue, max } = defineProps<TagsParamsInterface & { tagsValue: string[], blogData: BlogItemInterface[] }>()

/**
 * @type {const} activeTags - selected active tags
 */
const activeTags: Ref<string[]> = ref(tagsValue)

/**
 * @type {const} tags - generates a list of clickable tags
 */
const tags: Ref<string[]> = ref((() => {
    const counter: counterType[] = []
    blogData.forEach((blog: BlogItemInterface) => {
        if (!blog.tags || blog.tags.length === 0) return
        blog.tags.forEach((tag: string) => {
            const index: number = counter.findIndex((count: counterType) => count.tag === tag)
            if (index !== -1) {
                counter[index].occurence++

                return
            }

            counter.push({
                tag,
                occurence: 1,
            })
        })
    })

    const sortedTags: string[] = counter.sort((a: counterType, b: counterType) => b.occurence - a.occurence).map((count: counterType) => count.tag)

    return max ? sortedTags.slice(0, max) : sortedTags
})())

const emit = defineEmits<{
    (e: 'change', tg: string[]): void
}>()

/**
 * Event toggle handler to activate tags
 * 
 * @param {string} tag - name of tag
 */
const onClickAddHandler = (tag: string) => {
    activeTags.value = activeTags.value.includes(tag) ? activeTags.value.filter((t: string) => t !== tag) : [...activeTags.value, tag]
}

/**
 * Event handler for removing all active tags
 */
const onClickRemoveHandler = () => {
    activeTags.value = []
}

watch(activeTags, (tg: string[]) => {    
    emit('change', tg)
})
</script>

<template>
    <ul class="tags">
        <li class="title"><p>Tags</p></li>
        <li
            v-for="tag in tags"
            :key="tag"
            :class="['tag', { 'tag--active': activeTags.includes(tag) }]"
            @click="onClickAddHandler(tag)"
        >
            <p>{{ tag.toLocaleLowerCase() }}</p>
        </li>
        <li
            v-if="activeTags.length > 0"
            class="remove"
            @click="onClickRemoveHandler"
        >
            <CloseLineIcon
                width="18"
                height="18"
                alt="X"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@use '/src/styling/breakpoints.scss' as b;

.theme.theme--light .tag {
    background-color: var(--color-light-background-primary);
    border: 1px solid var(--color-light-border);

    p {
        color: black;
    }

    &--active {
        background-color: black;
        border-color: black;
        p {
            color: white;
        }
    }
}

.theme.theme--dark .tag {
    background-color: var(--color-dark-background-primary);
    border: 1px solid var(--color-dark-border);

    p {
        color: white;
    }

    &--active {
        background-color: white;
        border-color: white;

        p {
            color: black;
        }
    }
}

.tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    margin: 1rem auto;

    @include b.md {
        margin: 1rem 0;

        .title {
            margin-right: 0.3rem;
        }
    }

    p {
        margin: 0;
    }

    .tag {
        padding: 0.1rem 0.6rem;
        border-radius: 20rem;
        cursor: pointer;
        p {
            font-size: 0.7rem;
            @include b.md {
                font-size: 0.8rem;
            }
        }
    }

    .remove {
        cursor: pointer;
        margin-left: 0.3rem;
        display: flex;
        align-items: center;
    }
}
</style>
