
export default [
  {
    path: 'mobil',
    name: 'app.mobil',
    redirect: {name: 'app'},
    children: [
      {
        path: 'dataMobil',
        name: 'app.mobil.dataMobil.index',
        component: () => import('pages/app/car/carData/CarIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataSupir',
        name: 'app.mobil.dataSupir.index',
        component: () => import('pages/app/car/driverData/DriverIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataPinjamanSupir',
        name: 'app.mobil.dataPinjamanSupir.index',
        component: () => import('pages/app/car/loan/DriverLoanIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pinjamanBaru',
        name: 'app.mobil.pinjamanBaru.index',
        component: () => import('pages/app/car/loan/DriverLoanCreateIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'biayaMobil',
        name: 'app.mobil.biayaMobil.index',
        component: () => import('pages/app/car/cost/CarCostIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan',
        name: 'app.mobil.laporan.index',
        component: () => import('pages/app/car/report/ReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/penghasilanMobil',
        name: 'app.mobil.laporan.penghasilanMobil',
        component: () => import('pages/app/car/report/CarReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printPenghasilanMobil',
        name: 'app.mobil.laporan.printPenghasilanMobil',
        component: () => import('pages/app/car/report/CarReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/rekapPenghasilanMobil',
        name: 'app.mobil.laporan.rekapPenghasilanMobil',
        component: () => import('pages/app/car/report/CarRecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printRekapPenghasilanMobil',
        name: 'app.mobil.laporan.printRekapPenghasilanMobil',
        component: () => import('pages/app/car/report/CarRecapReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/pinjamanSupir',
        name: 'app.mobil.laporan.pinjamanSupir',
        component: () => import('pages/app/car/report/LoanReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printPinjamanSupir',
        name: 'app.mobil.laporan.printPinjamanSupir',
        component: () => import('pages/app/car/report/LoanReportPrint.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
