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

    ]
  },
]
