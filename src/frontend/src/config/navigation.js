import DashboardIcon from '@/assets/icons/dashboard.svg';

import RegisterView from '@/views/account/RegisterView.vue';
import LoginView from '@/views/login/LoginView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import ReferralsView from '@/views/referrals/ReferralsView.vue';
import NFTSView from '@/views/nfts/NFTSView.vue';
import HomeView from '@/views/home/HomeView.vue';

const navItems = [
    {
    path: '/dashboard',
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/account/register',
    name: "Register",
    component: RegisterView,
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/login',
    name: "Login",
    component: LoginView,
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/nfts',
    name: "NFTS",
    component: NFTSView,
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/home',
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/referrals',
    name: "Referrals",
    component: ReferralsView,
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
