<script setup lang="ts">

// data
import { BlogData } from '@/data/blog.ts'

// components
import BlogList from '@/components/blog/BlogList.vue'

// hooks
import { getDateFromTimestamp } from '@/hooks/use-conversion'

// icons/images
import CalendarLineIcon from '@/assets/icons/calendar-line.svg?component'
import HashtagIcon from '@/assets/icons/hashtag.svg?component'
</script>

<template>
    <main class="container">
        <BlogList :blog-data="BlogData">
            <template v-slot="{ blog }">
                <article class="blog-item">
                    <img
                        v-if="blog.image"
                        v-bind="blog.image"
                    />
                    <div class="content">
                        <h3>{{ blog.title }}</h3>
                        <ul class="meta">
                            <li>
                                <HashtagIcon
                                    width="10"
                                    height="10"
                                    alt="tag"
                                />
                                <p
                                    v-if="blog.tags"
                                    class="tags"
                                >
                                    {{ blog.tags.join(', ').toLocaleLowerCase() }}
                                </p>
                            </li>
                            <li>
                                <CalendarLineIcon
                                    width="10"
                                    height="10"
                                    alt="calendar"
                                />
                                <p
                                    v-if="blog.date"
                                    class="date"
                                >
                                    {{ getDateFromTimestamp(blog.date) }}
                                </p>
                            </li>
                        </ul>
                        <p
                            v-if="blog.intro"
                            class="intro"
                        >
                            {{ blog.intro }}
                        </p>
                    </div>
                </article>
            </template>
        </BlogList>
    </main>
</template>

<style lang="scss" scoped>
@use '/src/styling/breakpoints.scss' as b;

.theme.theme--light .blog-item {
    background-color: var(--color-light-background-secondary);

    ul.meta p, 
    ul.meta svg {
        color: var(--color-light-font-secondary);
    }
}

.theme.theme--dark .blog-item {
    background-color: var(--color-dark-background-secondary);

    ul.meta p, 
    ul.meta svg {
        color: var(--color-dark-font-secondary);
    }
}

.blog-item {
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 0.6rem;
    box-shadow: var(--box-shadow-default);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;

    .content {
        padding: 1.5rem;
        min-height: 12rem;

        @include b.md {
            min-height: 15rem;
        }
    }

    p {
        margin-bottom: 0;
    }

    img {
        display: flex;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }

    ul.meta {
        color: grey;
        margin: 0;

        li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        p {
            margin: 0;
            font-size: 0.7rem;
        }
    }

    .tags {
        display: flex;
        gap: 0.2rem;
    }

    .intro {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
    }
}
</style>
