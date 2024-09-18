import './index.scss';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import useAuthStore from './stores/auth.js';
import FriendQuery from '@/components/account/FriendQuery.vue';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.loadStateFromLocalStorage();

app.component('FriendQuery', FriendQuery);

// Use Toast with configuration
app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 5000, // Adjust as needed
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false
});

app.mount('#app');