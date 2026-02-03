import React from 'react'
import ReactDOM from 'react-dom/client'
import { createApp } from 'vue'
import './style.css'
import AppReact from './App'
import AppVue from './App.vue'

// Mount React app
const reactRoot = document.getElementById('react-root')
if (reactRoot) {
  ReactDOM.createRoot(reactRoot).render(
    <React.StrictMode>
      <AppReact />
    </React.StrictMode>
  )
}

// Mount Vue app
const vueRoot = document.getElementById('vue-root')
if (vueRoot) {
  createApp(AppVue).mount(vueRoot)
}
