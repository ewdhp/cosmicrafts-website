import DashboardIcon from '@/assets/icons/dashboard.svg';

import RegisterView from '@/views/account/RegisterView.vue';
import LoginView from '@/views/login/LoginView.vue';
import DBView from '@/views/dashboard/DashboardView.vue';
import REFView from '@/views/referrals/ReferralsView.vue';
import NFTSView from '@/views/nfts/NFTSView.vue';
import ACHView from '@/views/achievements/ACHView.vue';
const navItems = [
  {
    path: '/',
    name: "Dashboard",
    component: DBView,
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
    {
    path: '/dashboard',
    name: "Dashboard",
    component: DBView,
    meta: { requiresAuth: true },
    icon: DashboardIcon,
    children: []
  },
  {
    path: '/achievements',
    name: "Achievements", 
    component: ACHView,
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
    path: '/referrals',
    name: "Referrals",
    component: REFView,
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
