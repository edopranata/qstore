export default [
  {
    path: 'pinjaman',
    name: 'app.pinjaman',
    redirect: {name: 'app'},
    children: [
      {
        path: 'pinjamanPetani',
        name: 'app.pinjaman.pinjamanPetani.index',
        component: () => import('pages/app/loan/customerLoan/CustomerLoanIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
