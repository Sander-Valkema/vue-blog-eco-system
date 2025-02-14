<script setup lang="ts">
// vendor
import { ref, type Ref } from 'vue'
import { RouterLink } from 'vue-router'

// data
import { BlogData } from '@/data/blog.ts'

// hooks
import { getDateFromTimestamp } from '@/hooks/use-conversion'

// icons/images
import CalendarLineIcon from '@/assets/icons/calendar-line.svg?component'
import HashtagIcon from '@/assets/icons/hashtag.svg?component'

// models
import { BlogItem as BlogItemInterface } from '@/models/blog'

const { id } = defineProps<{ id: string }>()

// @ts-ignore
const blog: Ref<BlogItemInterface | undefined> = ref(BlogData.find((blog: BlogItemInterface) => blog.id === parseInt(id, 10)))
</script>

<template>
    <main class="container">
        <template v-if="blog">
            <ul class="breadcrumbs">
                <li><RouterLink :to="{ name: 'blog' }">blog</RouterLink></li>
                <li>{{ blog.title.toLowerCase() }}</li>
            </ul>
            <article v-if="blog">
                <img
                    v-if="blog.image"
                    class="banner-image"
                    v-bind="blog.image"
                />
                <ul class="meta">
                    <li v-if="blog.date">
                        <CalendarLineIcon
                            width="10"
                            height="10"
                            alt="calendar"
                        />
                        <p class="date">
                            {{ getDateFromTimestamp(blog.date) }}
                        </p>
                    </li>
                    <li v-if="blog.tags">
                        <HashtagIcon
                            width="10"
                            height="10"
                            alt="tag"
                        />
                        <p class="tags">
                            {{ blog.tags.join(', ').toLocaleLowerCase() }}
                        </p>
                    </li>
                </ul>
                <div class="content">
                    <h1>{{ blog.title }}</h1>
                    <div
                        v-if="blog.description"
                        class="description"
                        v-html="blog.description"
                    ></div>
                </div>
            </article>
        </template>
        <template v-else><h3>Sorry, this blog does not exist.</h3></template>
    </main>
</template>

<style lang="scss" scoped>
@use '/src/styling/breakpoints.scss' as b;

.theme {
    &.theme--light ul.meta {
        border-bottom: 1px solid var(--color-light-border);
    }

    &.theme--dark ul.meta {
        border-bottom: 1px solid var(--color-dark-border);
    }
}

ul.breadcrumbs {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 0.8rem;

    a {
        color: inherit;
        text-underline-offset: 2px;
    }

    li {
        position: relative;

        &:not(:last-child)::after {
            position: absolute;
            content: '>';
            top: 0;
            bottom: 0;
            margin: auto;
            right: -1rem;
        }
    }
}

article {
    .banner-image {
        width: 100%;
        object-fit: cover;
        object-position: center;
        height: 20rem;
    }

    ul.meta {
        display: flex;
        flex-direction: column;
        padding: 0.3rem 0;

        p {
            margin: 0;
            font-size: 0.8rem;
        }

        li {
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }

        @include b.md {
            flex-direction: row;
            align-items: center;
            gap: 1.2rem;
        }
    }

    h1 {
        margin: 1.5rem 0;
    }
}
</style>
