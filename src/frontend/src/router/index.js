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
  const isAuthenticated = authStore.isAuthenticated;
  const isRegistered = authStore.isRegistered;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isAuthenticated == false && isRegistered == false) {
      next({ path: '/login' });
    }
    else {
      if (isRegistered == false) {
        next({ path: '/register' });
      } else {
        next();
      } 
    }
  }else {
    next();
  } 
});

export default router;