export default [
  {
    path: 'laporan',
    name: 'app.laporan',
    redirect: {name: 'app'},
    children: [
      {
        path: 'dataLaporan',
        name: 'app.laporan.dataLaporan.index',
        component: () => import('pages/app/report/ReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/hasilKebun',
        name: 'app.laporan.dataLaporan.hasilKebun',
        component: () => import('pages/app/report/plantation/PlantationReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/printHasilKebun',
        name: 'app.laporan.dataLaporan.printHasilKebun',
        component: () => import('pages/app/report/plantation/PlantationReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'dataLaporan/hasilLahan',
        name: 'app.laporan.dataLaporan.hasilLahan',
        component: () => import('pages/app/report/plantation/LandReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/printHasilLahan',
        name: 'app.laporan.dataLaporan.printHasilLahan',
        component: () => import('pages/app/report/plantation/LandReportPrint.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/hasilLahanPerArea',
        name: 'app.laporan.dataLaporan.hasilLahanPerArea',
        component: () => import('pages/app/report/plantation/AreaReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/printHasilLahanPerArea',
        name: 'app.laporan.dataLaporan.printHasilLahanPerArea',
        component: () => import('pages/app/report/plantation/AreaReportPrint.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/penghasilanMobil',
        name: 'app.laporan.dataLaporan.penghasilanMobil',
        component: () => import('pages/app/report/car/CarReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/printPenghasilanMobil',
        name: 'app.laporan.dataLaporan.printPenghasilanMobil',
        component: () => import('pages/app/report/car/CarReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/rekapPenghasilanMobil',
        name: 'app.laporan.dataLaporan.rekapPenghasilanMobil',
        component: () => import('pages/app/report/car/CarRecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'dataLaporan/printRekapPenghasilanMobil',
        name: 'app.laporan.dataLaporan.printRekapPenghasilanMobil',
        component: () => import('pages/app/report/car/CarRecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
