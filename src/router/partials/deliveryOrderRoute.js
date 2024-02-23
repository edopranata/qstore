
export default [
  {
    path: 'deliveryOrder',
    name: 'app.deliveryOrder',
    redirect: {name: 'app'},
    children: [
      {
        path: 'dataPengepul',
        name: 'app.deliveryOrder.dataPengepul.index',
        component: () => import('pages/app/deliveryOrder/collector/CollectorIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
