import DashboardIcon from '@/assets/icons/dashboard.svg';
// Import other icons similarly

const navItems = {
  main: [
    { path: '/', name: "DashboardView", icon: DashboardIcon },
    { path: '/nfts', name: "NFTSView", icon: DashboardIcon },
    { path: '/tokens', name: "TokensView", icon: DashboardIcon },
    { path: '/referrals', name: "ReferralsView", icon: DashboardIcon },
    { path: '/statistics', name: "StatisticsView", icon: DashboardIcon },
    { path: '/tourneys', name: "TourneysView", icon: DashboardIcon }
  ],
  referrals: [
    { path: '/referrals/promos', name: "Promos" },
    { path: '/referrals/points', name: "Points" },
    { path: '/referrals/top-weekly', name: "Top Weekly" },
    { path: '/referrals/tiers', name: "Tiers" },
  ],
};

export default navItems;

