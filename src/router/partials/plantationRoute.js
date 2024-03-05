
export default [
  {
    path: 'perkebunan',
    name: 'app.perkebunan',
    redirect: {name: 'app'},
    children: [
      {
        path: 'wilayah',
        name: 'app.perkebunan.wilayah.index',
        component: () => import('pages/app/plantation/area/AreaIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'lahan',
        name: 'app.perkebunan.lahan.index',
        component: () => import('pages/app/plantation/land/LandIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'hasilKebun',
        name: 'app.perkebunan.hasilKebun.index',
        component: () => import('pages/app/plantation/transaction/PlantationIndex.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'biayaKebun',
        name: 'app.perkebunan.biayaKebun.index',
        component: () => import('pages/app/plantation/cost/PlantationCostIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan',
        name: 'app.perkebunan.laporan.index',
        component: () => import('pages/app/plantation/report/ReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/perkebunan',
        name: 'app.perkebunan.laporan.perkebunan',
        component: () => import('pages/app/plantation/report/PlantationReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printPerkebunan',
        name: 'app.perkebunan.laporan.printPerkebunan',
        component: () => import('pages/app/plantation/report/PlantationReportPrint.vue'),
        meta: {
          auth: true,
        },
      },

      {
        path: 'laporan/rekapituliasiPerkebunan',
        name: 'app.perkebunan.laporan.rekapituliasiPerkebunan',
        component: () => import('pages/app/plantation/report/PlantationRecapReportIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'laporan/printRekapituliasiPerkebunan',
        name: 'app.perkebunan.laporan.printRekapituliasiPerkebunan',
        component: () => import('pages/app/plantation/report/PlantationRecapReportPrint.vue'),
        meta: {
          auth: true,
        },
      },
    ]
  },
]
