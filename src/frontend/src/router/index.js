import { createRouter, createWebHistory } from 'vue-router';
import navItems from '../config/navigation.js';
import { useAuthStore } from '../stores/auth.js';



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: navItems 
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const authenticated = authStore.isAuthenticated();
  const registered = authStore.isRegistered();
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (authenticated == false && registered == false) {
      next({ path: '/login' });
    }
    else {
      if (registered == false) {
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