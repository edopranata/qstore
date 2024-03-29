
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
        path: 'laporan/deliveryOrderPlantation',
        name: 'app.deliveryOrder.laporan.deliveryOrderPerkebunan',
        component: () => import('pages/app/deliveryOrder/report/DOReportPlantationIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printDeliveryOrderPlantation',
        name: 'app.deliveryOrder.laporan.printdeliveryOrderPerkebunan',
        component: () => import('pages/app/deliveryOrder/report/DOReportPlantationPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/deliveryOrderTrading',
        name: 'app.deliveryOrder.laporan.deliveryOrderJualBeliSawit',
        component: () => import('pages/app/deliveryOrder/report/DOReportTradingIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printDeliveryOrderTrading',
        name: 'app.deliveryOrder.laporan.printdeliveryOrderJualBeliSawit',
        component: () => import('pages/app/deliveryOrder/report/DOReportTradingPrint.vue'),
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


      {
        path: 'laporan/pinjamanPengepul',
        name: 'app.deliveryOrder.laporan.pinjamanPengepul',
        component: () => import('pages/app/deliveryOrder/report/LoanReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printPinjamanPengepul',
        name: 'app.deliveryOrder.laporan.printPinjamanPengepul',
        component: () => import('pages/app/deliveryOrder/report/LoanReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/rekapPinjamanPengepul',
        name: 'app.deliveryOrder.laporan.rekapPinjamanPengepul',
        component: () => import('pages/app/deliveryOrder/report/LoanRecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printRekapPinjamanPengepul',
        name: 'app.deliveryOrder.laporan.printRekapPinjamanPengepul',
        component: () => import('pages/app/deliveryOrder/report/LoanRecapReportPrint.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
