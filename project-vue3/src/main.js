import { createApp } from 'vue'
// @ts-ignore
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import 'primevue/resources/themes/saga-green/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import 'primeflex/primeflex.css'

import PrimeVue from 'primevue/config'

createApp(App).use(router).use(PrimeVue).mount('#app')

