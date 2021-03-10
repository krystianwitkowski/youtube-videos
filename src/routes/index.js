import VueRouter from 'vue-router';

import SignIn from '../components/SignIn.vue';
import SignUp from '../components/SignUp.vue';
import Dashboard from '../components/Dashboard.vue';

const routes =  [
    {
      path: '/',
      component: SignIn
    },
    {
      path: '/signup',
      component: SignUp
    },
    {
      path: '/dashboard',
      component: Dashboard,
      beforeEnter: async (to, from, next) => {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        
        console.log(tokens);
        if(tokens){
          next();
        }
        
        else {
          next(false)
        }
      }
    }
]

export default new VueRouter({
    routes
})