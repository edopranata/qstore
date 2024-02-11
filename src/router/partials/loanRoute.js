export default [
  {
    path: 'pinjaman',
    name: 'app.pinjaman',
    redirect: {name: 'app'},
    children: [
      {
        path: 'dataPinjaman',
        name: 'app.pinjaman.dataPinjaman.index',
        component: () => import('pages/app/loan/CustomerLoanIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'pinjamanBaru',
        name: 'app.pinjaman.pinjamanBaru.index',
        component: () => import('pages/app/loan/CustomerLoanCreateIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
