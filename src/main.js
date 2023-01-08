// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from "axios"
import VueRouter from "vue-router"
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap/fonts/glyphicons-halflings-regular.eot'
import Routers from "./router/index";
import store from "./store/index"
import th from "element-ui/src/locale/lang/th";
import '../static/iconfont/iconfont.css'
import '../static/iconfont/iconfont.ttf'

Vue.config.productionTip = false
axios.defaults.withCredentials=true

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.$http = axios

const router = new VueRouter(Routers)

// router.beforeEach((to, from, next) => {
//   console.log(to.path)
//   console.log(to.meta.auth)
//   console.log(from.path)
//   // console.log(next())
//   // if (to.path === "/news"){
//   //   next({path: '/register'})
//   // }
//   next()
// })

/* eslint-disable no-new */


new Vue({
  el: '#app',
  components: {App},
  template: '<App/>',
  router:router,
  store:store,
})
