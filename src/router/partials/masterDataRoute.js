
export default [
  {
    path: 'masterData',
    name: 'app.masterData',
    redirect: {name: 'app'},
    children: [
      {
        path: 'cars',
        name: 'app.masterData.cars.index',
        component: () => import('pages/app/masterData/car/CarIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'drivers',
        name: 'app.masterData.drivers.index',
        component: () => import('pages/app/masterData/driver/DriverIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'customers',
        name: 'app.masterData.customers.index',
        component: () => import('pages/app/masterData/customer/CustomerIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'areas',
        name: 'app.masterData.areas.index',
        component: () => import('pages/app/masterData/area/AreaIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
