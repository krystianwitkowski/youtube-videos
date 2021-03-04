import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import router from './routes/index.js';

import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
      search: 'Google',
      order: 'relevance',
      nextPageToken: '',
      items: []
  },
  mutations: {
    addNextPageToken(state, payload){
      return state.nextPageToken = payload.nextPageToken
    },
    addItems(state, payload){
      if(payload.scroll){
        return state.items = [...state.items, ...payload.items];
      }
      else {
        return state.items = [...payload.items]
      }
    },
    setOrder(state, payload){
      return state.order = payload.order
    },
    setSearch(state, payload){
      return state.search = payload.value
    }
  }
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
