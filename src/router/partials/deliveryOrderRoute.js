
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
        component: () => import('pages/app/deliveryOrder/invoice/InvoiceDeliveryOrderIndex.vue'),
        meta: {
          auth: true,
        },
      },


      {
        path: 'dataInvoicePengepul',
        name: 'app.deliveryOrder.dataInvoicePengepul.index',
        component: () => import('pages/app/deliveryOrder/invoice/InvoiceDataIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataInvoicePengepul/:invoice_number/print',
        name: 'app.deliveryOrder.dataInvoicePengepul.printInvoice',
        component: () => import('pages/app/deliveryOrder/invoice/InvoicePrint.vue'),
        meta: {
          auth: true,
        },
      },


      {
        path: 'dataPinjamanPengepul',
        name: 'app.deliveryOrder.dataPinjamanPengepul.index',
        component: () => import('pages/app/deliveryOrder/loan/CustomerLoanIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pinjamanBaru',
        name: 'app.deliveryOrder.pinjamanBaru.index',
        component: () => import('pages/app/deliveryOrder/loan/CustomerLoanCreateIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan',
        name: 'app.deliveryOrder.laporan.index',
        component: () => import('pages/app/deliveryOrder/report/ReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/deliveryOrder',
        name: 'app.deliveryOrder.laporan.deliveryOrder',
        component: () => import('pages/app/deliveryOrder/report/DOReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printDeliveryOrder',
        name: 'app.deliveryOrder.laporan.printdeliveryOrder',
        component: () => import('pages/app/deliveryOrder/report/DOReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/rekapitulasiDO',
        name: 'app.deliveryOrder.laporan.rekapitulasiDO',
        component: () => import('pages/app/deliveryOrder/report/DORecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printRekapitulasiDO',
        name: 'app.deliveryOrder.laporan.printRekapitulasiDO',
        component: () => import('pages/app/deliveryOrder/report/DORecapReportPrint.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
