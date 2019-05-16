import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import Mint from 'mint-ui';
import axios from 'axios';
import 'mint-ui/lib/style.css';
import '@/common/css/reset.css';
import '@/common/css/resets.css';
import '@/common/css/Size.css';
import '@/common/js/rem.js';
import 'jquery';
import 'swiper/dist/css/swiper.css';
import * as moment from '@/common/js/filter'
import Api from '@/api/index'


Object.keys(moment).forEach(key => {
  Vue.filter(key, moment[key])
})
axios.defaults.baseURL='http://test99.yunyikang.cn/';//测试
// axios.defaults.baseURL='https://www.yunyikang.cn/';//正式
Vue.prototype.$http = axios;
Vue.prototype.$https = Api;
Vue.use(Mint);

Vue.config.productionTip = false;


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
