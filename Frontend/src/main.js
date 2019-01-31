import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import Navigation from './components/Navigation'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.component("navigation", Navigation);

new Vue({
  el: '#app',
  render: h => h(App)
})
