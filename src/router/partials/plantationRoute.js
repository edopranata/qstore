
export default [
  {
    path: 'perkebunan',
    name: 'app.perkebunan',
    redirect: {name: 'app'},
    children: [
      {
        path: 'wilayah',
        name: 'app.perkebunan.wilayah.index',
        component: () => import('pages/app/plantation/area/AreaIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'lahan',
        name: 'app.perkebunan.lahan.index',
        component: () => import('pages/app/plantation/land/LandIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'hasilKebun',
        name: 'app.perkebunan.hasilKebun.index',
        component: () => import('pages/app/plantation/transaction/PlantationIndex.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'biayaKebun',
        name: 'app.perkebunan.biayaKebun.index',
        component: () => import('pages/app/plantation/cost/PlantationCostIndex.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
