import LogoutPage from 'pages/LogoutPage.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresRole: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_RH'] },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]

  },
  {
    path: '/manage',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresRole: ['ROLE_ADMIN', 'ROLE_RH'] },
    children: [
      { path: '', component: () => import('pages/ManagerList.vue') }
    ]
  },
  {
    path: '/interviews',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresRole: ['ROLE_USER','ROLE_ADMIN', 'ROLE_RH'] },
    children: [
      { path: '', component: () => import('pages/InterviewPage.vue') }
    ]

  },
  {
    path: '/logout',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: LogoutPage}
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
