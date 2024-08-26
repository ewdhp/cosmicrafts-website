import DashboardIcon from '@/assets/icons/dashboard.svg';
const navItems = [
  {
    path: '/login',
    name: "Login",
    component: 'LoginView',
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/',
    name: "Home",
    component: 'HomeView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/dashboard',
    name: "Dashboard",
    component: 'DashboardView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/nfts',
    name: "NFTS",
    component: 'NFTSView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/tokens',
    name: "Tokens",
    component: 'TokensView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/referrals',
    name: "Referrals",
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
    name: "Statistics",
    component: 'StatisticsView',
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/tourneys',
    name: "Tourneys",
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
