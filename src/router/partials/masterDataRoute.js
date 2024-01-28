
export default [
  {
    path: 'masterData',
    name: 'app.masterData',
    redirect: {name: 'app'},
    children: [
      {
        path: 'mobil',
        name: 'app.masterData.mobil.index',
        component: () => import('pages/app/masterData/car/CarIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'supir',
        name: 'app.masterData.supir.index',
        component: () => import('pages/app/masterData/driver/DriverIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pelanggan',
        name: 'app.masterData.pelanggan.index',
        component: () => import('pages/app/masterData/customer/CustomerIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'wilayah',
        name: 'app.masterData.wilayah.index',
        component: () => import('pages/app/masterData/area/AreaIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'lahan',
        name: 'app.masterData.lahan.index',
        component: () => import('pages/app/masterData/land/LandIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
