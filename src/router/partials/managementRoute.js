
export default [
  {
    path: 'management',
    name: 'app.management',
    redirect: {name: 'app'},
    children: [
      {
        path: 'users',
        name: 'app.management.users.index',
        component: () => import('pages/management/users/UserIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'roles',
        name: 'app.management.roles.index',
        component: () => import('pages/management/roles/RolesIndex.vue'),
        meta: {
          auth: true,
        },
      },
      // {
      //   path: 'roles/:id/view',
      //   name: 'app.management.roles.viewRole',
      //   component: () => import('pages/management/roles/RolesView.vue'),
      //   meta: {
      //     auth: true,
      //   },
      //
      // },
      {
        path: 'permissions',
        name: 'app.management.permissions.index',
        component: () => import('pages/management/permissions/PermissionIndex.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: 'permissions/:id/view',
        name: 'app.management.permissions.viewPermission',
        component: () => import('pages/management/permissions/PermissionView.vue'),
        meta: {
          middleware: {
            auth: true,
          },
        },
      },
    ]
  },
]
