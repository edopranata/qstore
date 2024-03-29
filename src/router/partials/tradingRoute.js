
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
      {
        path: 'dataInvoicePetani',
        name: 'app.jualBeliSawit.dataInvoicePetani.index',
        component: () => import('pages/app/trading/invoice/InvoiceDataIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataInvoicePetani/:invoice_number/print',
        name: 'app.jualBeliSawit.dataInvoicePetani.printInvoice',
        component: () => import('pages/app/trading/invoice/InvoicePrint.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'biayaJualBeliSawit',
        name: 'app.jualBeliSawit.biayaJualBeliSawit.index',
        component: () => import('pages/app/trading/cost/TradingCostIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'buatInvoicePetani',
        name: 'app.jualBeliSawit.buatInvoicePetani.index',
        component: () => import('pages/app/trading/invoice/InvoiceTradingIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'buatInvoicePetani/:id/details',
        name: 'app.jualBeliSawit.buatInvoicePetani.details',
        component: () => import('pages/app/trading/invoice/InvoiceTradingDetails.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataPinjamanPetani',
        name: 'app.jualBeliSawit.dataPinjamanPetani.index',
        component: () => import('pages/app/trading/loan/CustomerLoanIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pinjamanBaru',
        name: 'app.jualBeliSawit.pinjamanBaru.index',
        component: () => import('pages/app/trading/loan/CustomerLoanCreateIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan',
        name: 'app.jualBeliSawit.laporan.index',
        component: () => import('pages/app/trading/report/ReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/jualBeliSawit',
        name: 'app.jualBeliSawit.laporan.jualBeliSawit',
        component: () => import('pages/app/trading/report/TradingReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printJualBeliSawit',
        name: 'app.jualBeliSawit.laporan.printJualBeliSawit',
        component: () => import('pages/app/trading/report/TradingReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/rekapituliasiJualBeliSawit',
        name: 'app.jualBeliSawit.laporan.rekapituliasiJualBeliSawit',
        component: () => import('pages/app/trading/report/TradingRecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printRekapituliasiJualBeliSawit',
        name: 'app.jualBeliSawit.laporan.printRekapituliasiJualBeliSawit',
        component: () => import('pages/app/trading/report/TradingRecapReportPrint.vue'),
        meta: {
          auth: true,
        },
      },



      {
        path: 'laporan/pinjamanPetani',
        name: 'app.jualBeliSawit.laporan.pinjamanPetani',
        component: () => import('pages/app/trading/report/LoanReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printPinjamanPetani',
        name: 'app.jualBeliSawit.laporan.printPinjamanPetani',
        component: () => import('pages/app/trading/report/LoanReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/rekapPinjamanPetani',
        name: 'app.jualBeliSawit.laporan.rekapPinjamanPetani',
        component: () => import('pages/app/trading/report/LoanRecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printRekapPinjamanPetani',
        name: 'app.jualBeliSawit.laporan.printRekapPinjamanPetani',
        component: () => import('pages/app/trading/report/LoanRecapReportPrint.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
