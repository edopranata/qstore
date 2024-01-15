
export default [
  {
    path: 'settings',
    name: 'app.settings',
    redirect: {name: 'app'},
    children: [
      {
        path: 'menu',
        name: 'app.settings.menu.index',
        component: () => import('pages/setting/menu/MenuIndex.vue'),
        meta: {
          auth: true,
        },
      },

    ]
  },
]
