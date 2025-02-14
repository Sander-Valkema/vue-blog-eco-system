// vendor
import { createRouter, createWebHistory, type RouteLocation, type NavigationGuardNext } from 'vue-router'

// store
import { useFilterStore  } from '@/stores/filter.ts'

// pages
import Blog from '@/pages/Blog.vue'
import Article from '@/pages/Article.vue'
import Page404 from '@/pages/404.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: {
                name: 'blog'
            }
        },
        {
            path: '/blog',
            name: 'blog',
            component: Blog,
        },
        {
            path: '/blog/:id/:title',
            name: 'blogItem',
            component: Article,
            props: true
        },
        { 
            path: '/:pathMatch(.*)*', 
            component: Page404
        }
    ],
})

router.beforeResolve(async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
    const store = useFilterStore()
    store.to = to
    next()
})

export default router