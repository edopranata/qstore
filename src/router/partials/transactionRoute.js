export default [
  {
    path: 'transaction',
    name: 'app.transaction',
    redirect: {name: 'app'},
    children: [
      {
        path: 'deliveryOrders',
        name: 'app.transaction.deliveryOrders.index',
        component: () => import('pages/app/transaction/deliveryOrders/deliveryOrderIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pembelianSawit',
        name: 'app.transaction.pembelianSawit.index',
        component: () => import('pages/app/transaction/buyPalms/BuyPalmIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pembelianSawit/:id/details',
        name: 'app.transaction.pembelianSawit.viewDetailsTransaction',
        component: () => import('pages/app/transaction/buyPalms/BuyPalmView.vue'),
        meta: {
          middleware: {
            auth: true,
          },
        },
      },
      {
        path: 'hasilKebun',
        name: 'app.transaction.hasilKebun.index',
        component: () => import('pages/app/transaction/plantation/PlantationIndex.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
