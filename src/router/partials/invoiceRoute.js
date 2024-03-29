export default [
  {
    path: 'invoice',
    name: 'app.invoice',
    redirect: {name: 'app'},
    children: [
      {
        path: 'buatInvoiceDO',
        name: 'app.invoice.buatInvoiceDO.index',
        component: () => import('pages/app/deliveryOrder/invoice/InvoiceDeliveryOrderIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'buatInvoicePetani',
        name: 'app.invoice.buatInvoicePetani.index',
        component: () => import('pages/app/invoice/Trading/InvoiceTradingIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'invoiceData',
        name: 'app.invoice.invoiceData.index',
        component: () => import('pages/app/invoice/invoiceData/InvoiceDataIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'invoiceData/:invoice_number/print',
        name: 'app.invoice.invoiceData.printInvoice',
        component: () => import('pages/app/invoice/invoiceData/InvoicePrint.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
