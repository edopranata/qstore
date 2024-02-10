export default [
  {
    path: 'laporan',
    name: 'app.laporan',
    redirect: {name: 'app'},
    children: [
      {
        path: 'hasilKebun',
        name: 'app.laporan.hasilKebun.index',
        component: () => import('pages/app/report/plantation/ReportPlantationIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
