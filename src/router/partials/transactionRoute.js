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
    ]
  },
]
