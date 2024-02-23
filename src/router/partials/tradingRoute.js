
export default [
  {
    path: 'jualBeliSawit',
    name: 'app.jualBeliSawit',
    redirect: {name: 'app'},
    children: [
      {
        path: 'dataPetani',
        name: 'app.jualBeliSawit.dataPetani.index',
        component: () => import('pages/app/trading/farmer/FarmerIndex.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'pembelianSawit',
        name: 'app.jualBeliSawit.pembelianSawit.index',
        component: () => import('pages/app/trading/transaction/TradingIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pembelianSawit/:id/details',
        name: 'app.jualBeliSawit.pembelianSawit.viewDetailsTransaction',
        component: () => import('pages/app/trading/transaction/TradingView.vue'),
        meta: {
          middleware: {
            auth: true,
          },
        },
      },


    ]
  },
]
