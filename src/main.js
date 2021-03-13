import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {BootstrapVue} from 'bootstrap-vue'
import ApiService from '@/services/api.service'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

ApiService.init('http://localhost:5000/api/');

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
