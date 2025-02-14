import '@/styling/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import App from '@/pages/_App.vue'
import router from '@/router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueCookies, { expires: '14d'})

app.mount('#app')