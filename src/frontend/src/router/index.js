import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '@/views/dashboard/DashboardView.vue';
import AccountView from '@/views/account/AccountView.vue';
import NFTSView from '@/views/nfts/NFTSView.vue';
import ReferralsView from '@/views/referrals/ReferralsView.vue';
import StatisticsView from '@/views/statistics/StatisticsView.vue';
import TokensView from '@/views/tokens/TokensView.vue';
import TourneysView from '@/views/tourneys/TourneysView.vue';

const routes = [
    { path: '/', component: DashboardView },
    { path: '/account', component: AccountView },
    { path: '/nfts', component: NFTSView },
    { path: '/tokens', component: TokensView },
    { path: '/referrals', component: ReferralsView },
    { path: '/statistics', component: StatisticsView },
    { path: '/tourneys', component: TourneysView },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
