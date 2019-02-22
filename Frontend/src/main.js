import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import Navigation from './components/Navigation'
import 'vuetify/dist/vuetify.min.css'
import * as VueGoogleMaps from 'vue2-google-maps'
 
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCgE3lJIVFNEK1N4iWKaPpU9hvKvmeASCU',
    libraries: 'places', 
  },
})
Vue.use(Vuetify)

Vue.component("navigation", Navigation);

new Vue({
  el: '#app',
  render: h => h(App)
})
