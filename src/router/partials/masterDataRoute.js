
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

    ]
  },
]
