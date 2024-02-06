export default [
  {
    path: 'invoice',
    name: 'app.invoice',
    redirect: {name: 'app'},
    children: [
      {
        path: 'deliveryOrder',
        name: 'app.invoice.deliveryOrder.index',
        component: () => import('pages/app/invoice/deliveryOrder/InvoiceDeliveryOrderIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
