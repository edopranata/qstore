export default [
  {
    path: 'pinjaman',
    name: 'app.pinjaman',
    redirect: {name: 'app'},
    children: [
      {
        path: 'dataPinjaman',
        name: 'app.pinjaman.dataPinjaman.index',
        component: () => import('pages/app/loan/customerLoan/CustomerLoanIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
