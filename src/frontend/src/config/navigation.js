import DashboardIcon from '@/assets/icons/dashboard.svg';
const navItems = [
  {
    path: '/login',
    name: "LoginView",
    component: 'LoginView',
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/',
    name: "HomeView",
    component: 'HomeView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/dashboard',
    name: "DashboardView",
    component: 'DashboardView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/nfts',
    name: "NFTSView",
    component: 'NFTSView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/tokens',
    name: "TokensView",
    component: 'TokensView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/referrals',
    name: "ReferralsView",
    component: 'ReferralsView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: [
      {
        path: '/referrals/promos',
        name: "Promos",
        component: 'PromosView',
        meta: { requiresAuth: true },
        children: []
      },
      // other children
    ]
  },
  {
    path: '/statistics',
    name: "StatisticsView",
    component: 'StatisticsView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/tourneys',
    name: "TourneysView",
    component: 'TourneysView',
    meta: { requiresAuth: true },
    children: [
      {
        path: '/tourneys/online',
        name: "Online",
        component: 'OnlineView',
        meta: { requiresAuth: true },
        children: []
      },
      // other children
    ]
  }
];

export default navItems;
