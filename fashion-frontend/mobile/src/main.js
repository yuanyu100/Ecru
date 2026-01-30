import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import * as Pinia from 'pinia'

const app = createApp(App)

app.use(store)
app.mount('#app')