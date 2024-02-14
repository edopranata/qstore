export default [
  {
    path: 'biaya',
    name: 'app.biaya',
    redirect: {name: 'app'},
    children: [
      {
        path: 'biayaMobil',
        name: 'app.biaya.biayaMobil.index',
        component: () => import('pages/app/cost/car/CarCostIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'biayaPembelianSawit',
        name: 'app.biaya.biayaPembelianSawit.index',
        component: () => import('pages/app/cost/trading/TradingCostIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'biayaKebun',
        name: 'app.biaya.biayaKebun.index',
        component: () => import('pages/app/cost/plantation/PlantationCostIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
