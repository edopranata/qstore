
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
      {
        path: 'transaksiDO',
        name: 'app.deliveryOrder.transaksiDO.index',
        component: () => import('pages/app/deliveryOrder/transaction/deliveryOrderIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'buatInvoiceDO',
        name: 'app.deliveryOrder.buatInvoiceDO.index',
        component: () => import('pages/app/invoice/deliveryOrder/InvoiceDeliveryOrderIndex.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'invoiceData/:invoice_number/print',
        name: 'app.deliveryOrder.invoiceData.printInvoice',
        component: () => import('pages/app/invoice/invoiceData/InvoicePrint.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
