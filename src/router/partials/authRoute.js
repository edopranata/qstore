import {LocalStorage} from "quasar";

export default [
  {
    path: '/auth',
    component: () => import('layouts/GuestLayout.vue'),
    redirect: {name: 'auth.login'},
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: () => import('pages/auth/LoginIndex.vue'),
        beforeEnter: (to, from, next) => {
          if (LocalStorage.has('token')) {
            next({name: 'app'});
          } else {
            next()
          }
        }
      }
    ],
  }
]
