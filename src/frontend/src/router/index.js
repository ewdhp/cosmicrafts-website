import { createRouter, createWebHistory } from 'vue-router';
import navItems from '../config/navigation.js';
import { useAuthStore } from '../stores/auth.js';

// Create the router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: navItems 
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth)
    && authStore.isAuthenticated == true)
  {
    next();
  }
});

export default router;