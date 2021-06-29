import Vue from 'vue'
import store from './store'
import App from './App.vue'
import VueMask from 'v-mask'
import router from './router'
import Vuelidate from 'vuelidate'
import { auth } from './firebase'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(VueMask)
Vue.use(Vuelidate)

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})