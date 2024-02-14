import authRoute from "src/router/partials/authRoute";
import managementRoute from "src/router/partials/managementRoute";
import settingsRoute from "src/router/partials/settingsRoute";
import masterDataRoute from "src/router/partials/masterDataRoute";
import transactionRoute from "src/router/partials/transactionRoute";
import invoiceRoute from "src/router/partials/invoiceRoute"
import loanRoute from "src/router/partials/loanRoute";
import reportRoute from "src/router/partials/reportRoute";
import costRoute from "src/router/partials/costRoute";

const routes = [
  {
    path: '/',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: "unauthorized",
        name: "app.unauthorized",
        component: () => import("pages/ErrorPage403.vue")
      },
    ],
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'app.index',
        component: () => import('pages/app/AppIndex.vue'),
        meta: {
          auth: true
        }
      },
      ...managementRoute,
      ...settingsRoute,
      ...masterDataRoute,
      ...transactionRoute,
      ...invoiceRoute,
      ...costRoute,
      ...loanRoute,
      ...reportRoute,
    ]
  },
  ...authRoute,



  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: () => import("pages/ErrorPage401.vue")
  },
]

export default routes
