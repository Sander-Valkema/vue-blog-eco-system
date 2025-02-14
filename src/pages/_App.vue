<script setup lang="ts">

// vendor
import { RouterView, RouterLink } from 'vue-router'
import { ref, inject, onBeforeMount, type Ref } from 'vue'
import { type VueCookies } from 'vue-cookies'

// icons/images
import PaintBrushLineIcon from '@/assets/icons/paint-brush-line.svg?component'
import ArticleLineIcon from '@/assets/icons/article-line.svg?component'

// models
export type RootType = 'light' | 'dark'
export type ThemeType = RootType | 'system'

// constants
const $cookies: VueCookies | undefined = inject('$cookies')
const isSystemDarkMode: Ref<boolean> = ref(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
const theme: Ref<ThemeType> = ref('system')

/**
 * Event handler for theme color selection field
 * 
 * @param {Event} event - theme color value
 */    
const onChangeHandler = (event: Event) => {
    const value = (event.target as HTMLInputElement).value as ThemeType
    if ($cookies) $cookies.set('theme', value)
    theme.value = value
}

/**
 * Get color scheme
 * 
 * @param {ThemeType} tt - theme options
 */
const getColorScheme = (tt: ThemeType): RootType => {
    if (tt === 'system') return isSystemDarkMode.value ? 'dark' : 'light'

    return tt
}

onBeforeMount(() => {    
    // set initial theme when theme preference was already stored as a cookie
    if ($cookies && $cookies.isKey('theme')) theme.value = $cookies.get('theme')
})
</script>

<template>
    <div :class="['theme', `theme--${getColorScheme(theme)}`]">
        <header>
            <div class="logo-container">
                <RouterLink :to="{ name: 'blog' }">
                    <h2>Vue Demo</h2>
                    <h4>Blog Eco System</h4>
                </RouterLink>
            </div>
            <fieldset>
                <PaintBrushLineIcon
                    width="16"
                    height="16"
                    alt="paint brush"
                />
                <select
                    class="theme"
                    :value="theme"
                    @change="onChangeHandler"
                >
                    <option
                        v-for="th in ['system', 'light', 'dark'] as ThemeType[]"
                        :key="th"
                        :value="th"
                    >
                        {{ th }}
                    </option>
                </select>
            </fieldset>
            <ArticleLineIcon class="header-logo" alt="article" />
        </header>
        <ArticleLineIcon class="background-logo" alt="article" />
        <RouterView />

        <footer class="author">developed by Sander Valkema</footer>
    </div>
</template>

<style lang="scss" scoped>
@use '/src/styling/breakpoints.scss' as b;

.theme {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;

    &.theme--light {
        header {
            background-color: var(--color-light-background-primary);
        }
        
        select {
            border: 1px solid var(--color-light-border);
        }

        .background-logo {
            opacity: 0.035;
        }
    }

    &.theme--dark {
        header {
            background-color: var(--color-dark-background-primary);
        }

        select {
            border: 1px solid var(--color-dark-border);
        }

        .background-logo {
            opacity: 0.01;
        }
    }
}

header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.3rem;
    z-index: var(--z-index-header);
    box-shadow: var(--box-shadow-default);
    overflow: hidden;

    @include b.md {
        padding: 0.8rem 1rem;
    }

    .header-logo {
        position: absolute;
        width: 10rem;
        height: 10rem;
        left: -1rem;
        transform: rotate(-45deg);
        opacity: 0.08;
        pointer-events: none;
    }

    h2,
    h3,
    h4 {
        margin: 0;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    .logo-container {
        line-height: 1rem;
    }

    fieldset {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;

        p {
            margin: 0;
        }
        
        svg {
            position: absolute;
            left: 0.5rem;
            z-index: 1;
        }
        
        select {
            width: 100%;
            border-radius: 60rem;
            padding: 0.2rem 1rem 0.2rem 2rem;
            cursor: pointer;
            text-align: center;

            option {
                text-align: center;
            }
        }
    }
}

.background-logo {
    position: fixed;
    width: 130rem;
    height: 130rem;
    left: -10rem;
    bottom: -40rem;
    right: 0;
    margin: auto;
    transform: rotate(24deg);    
    pointer-events: none;
}

footer {
    user-select: none;
    text-align: center;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;

    @include b.md {
        text-align: end;
    }
}
</style>
