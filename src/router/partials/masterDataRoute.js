
export default [
  {
    path: 'masterData',
    name: 'app.masterData',
    redirect: {name: 'app'},
    children: [
      {
        path: 'atm',
        name: 'app.masterData.atm.index',
        component: () => import('pages/masterData/atm/AtmIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
