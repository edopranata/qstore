
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
      {
        path: 'dataPinjamanSupir',
        name: 'app.mobil.dataPinjamanSupir.index',
        component: () => import('pages/app/car/loan/DriverLoanIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pinjamanBaru',
        name: 'app.mobil.pinjamanBaru.index',
        component: () => import('pages/app/car/loan/DriverLoanCreateIndex.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
