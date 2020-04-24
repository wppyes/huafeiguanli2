// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Cookies from 'js-cookie'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Element from 'element-ui'
import '@/styles/index.scss'
import '@/styles/fontawesome.min.css'
import './icons' // icon;
import VueWechatTitle from 'vue-wechat-title';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import qs from 'qs'

Vue.config.productionTip = false
Vue.use(Element);
Vue.use(VueWechatTitle);
Vue.prototype.$qs = qs
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})