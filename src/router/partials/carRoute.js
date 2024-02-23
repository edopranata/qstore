
export default [
  {
    path: 'mobil',
    name: 'app.mobil',
    redirect: {name: 'app'},
    children: [
      {
        path: 'dataMobil',
        name: 'app.mobil.dataMobil.index',
        component: () => import('pages/app/car/carData/CarIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataSupir',
        name: 'app.mobil.dataSupir.index',
        component: () => import('pages/app/car/driverData/DriverIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
