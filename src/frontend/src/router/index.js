import { createRouter, createWebHistory } from 'vue-router';
import navItems from '../config/navigation.js';
import useAuthStore from '../stores/auth.js';

// Helper function to generate routes
const createRoutesFromNavItems = (navItems) => {
  return navItems.flatMap(item => {
    // Main route
    const route = {
      path: item.path,
      component: () => import(`../views/${item.path.replace(/^\//, '')}/${item.component}.vue`),
      meta: item.meta || {}, // Include meta property
    };

    // Handle children routes
    const childrenRoutes = Array.isArray(item.children) ? item.children.map(child => ({
      path: `${item.path}${child.path}`,
      component: () => import(`../views/${child.path.replace(/^\//, '')}/${child.component}.vue`),
      meta: child.meta || {}, // Include meta property
    })) : [];

    return [route, ...childrenRoutes];
  });
};

// Flatten the navItems array and create routes
const routes = createRoutesFromNavItems(navItems);

// Create the router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;