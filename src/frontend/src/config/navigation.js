// Import view components
import DBView from '@/views/dashboard/DBView.vue';
import ACHView from '@/views/achievements/ACHView.vue';
import NFTSView from '@/views/nfts/NFTSView.vue';
import TNYDashView from '@/views/tournaments/DashboardView.vue';
import TNYView from '@/views/tournaments/TournamentView.vue';
import REGView from '@/views/account/REGView.vue';
import STATView from '@/views/stats/STATView.vue';
import TKView from '@/views/tokens/TKView.vue';
import LoginView from '@/views/login/LoginView.vue';
import MainLayout from '@/views/layout/MainLayout.vue';

// Import icons for all states
import DashboardActiveIcon from '@/assets/icons/dashboard-active.svg';
import DashboardHoverIcon from '@/assets/icons/dashboard-hover.svg';
import DashboardInactiveIcon from '@/assets/icons/dashboard-inactive.svg';

import AchievementsActiveIcon from '@/assets/icons/achievements-active.svg';
import AchievementsHoverIcon from '@/assets/icons/achievements-hover.svg';
import AchievementsInactiveIcon from '@/assets/icons/achievements-inactive.svg';

import RegisterActiveIcon from '@/assets/icons/friends-active.svg';
import RegisterHoverIcon from '@/assets/icons/friends-hover.svg';
import RegisterInactiveIcon from '@/assets/icons/friends-inactive.svg';

import LoginActiveIcon from '@/assets/icons/chat-active.svg';
import LoginHoverIcon from '@/assets/icons/chat-hover.svg';
import LoginInactiveIcon from '@/assets/icons/chat-inactive.svg';

import NFTSActiveIcon from '@/assets/icons/wallet-active.svg';
import NFTSHoverIcon from '@/assets/icons/wallet-hover.svg';
import NFTSInactiveIcon from '@/assets/icons/wallet-inactive.svg';

import ReferralsActiveIcon from '@/assets/icons/referrals-active.svg';
import ReferralsHoverIcon from '@/assets/icons/referrals-hover.svg';
import ReferralsInactiveIcon from '@/assets/icons/referrals-inactive.svg';

import StatisticsActiveIcon from '@/assets/icons/leaderboards-active.svg';
import StatisticsHoverIcon from '@/assets/icons/leaderboards-hover.svg';
import StatisticsInactiveIcon from '@/assets/icons/leaderboards-inactive.svg';

import TourneysActiveIcon from '@/assets/icons/tourneys-active.svg';
import TourneysHoverIcon from '@/assets/icons/tourneys-hover.svg';
import TourneysInactiveIcon from '@/assets/icons/tourneys-inactive.svg';

const navItems = [
  {
    path: '/login',
    name: "Login",
    component: LoginView,
    icons: { 
      active: LoginActiveIcon,
      hover: LoginHoverIcon,
      inactive: LoginInactiveIcon,
    },
    children: []
  },
  {
    path: '/register',
    name: "Register",
    component: REGView,
    icons: { 
      active: RegisterActiveIcon,
      hover: RegisterHoverIcon,
      inactive: RegisterInactiveIcon,
    },
    children: []
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: "Dashboard",
        component: DBView,
        meta: { requiresAuth: true },
        icons: { // This needs to be "icons" with the active/hover/inactive states
          active: DashboardActiveIcon,
          hover: DashboardHoverIcon,
          inactive: DashboardInactiveIcon,
        },
        children: []
      },
      {
        path: '/achievements',
        name: "Achievements", 
        component: ACHView,
        meta: { requiresAuth: true },
        icons: { 
          active: AchievementsActiveIcon, 
          hover: AchievementsHoverIcon,
          inactive: AchievementsInactiveIcon,
        },
        children: []
      },
      {
        path: '/nfts',
        name: "NFTS",
        component: NFTSView,
        meta: { requiresAuth: true },
        icons: { 
          active: NFTSActiveIcon,
          hover: NFTSHoverIcon,
          inactive: NFTSInactiveIcon,
        },
        children: []
      },
      {
        path: '/statistics',
        name: "Statistics",
        component: STATView,
        meta: { requiresAuth: true },
        icons: { 
          active: StatisticsActiveIcon,
          hover: StatisticsHoverIcon,
          inactive: StatisticsInactiveIcon,
        },
        children: []
      },
      {
        path: '/tournament',
        name: "Tournament Dashboard",
        component: TNYDashView,
        meta: { requiresAuth: true },
        icons: { 
          active: TourneysActiveIcon,
          hover: TourneysHoverIcon,
          inactive: TourneysInactiveIcon,
        },
        children: [
          {
            path: '/tournament/:id',
            name: "Tournament",
            component: TNYView,
            meta: { requiresAuth: true },
            icons: { 
              active: TourneysActiveIcon,
              hover: TourneysHoverIcon,
              inactive: TourneysInactiveIcon,
            },
            children: []
          },
        ]
      },
      {
        path: '/tokens',
        name: "Tokens",
        component: TKView,
        meta: { requiresAuth: true },
        icons: { 
          active: StatisticsActiveIcon,
          hover: StatisticsHoverIcon,
          inactive: StatisticsInactiveIcon,
        },
        children: []
      },
    ]
  },

];

export default navItems;
