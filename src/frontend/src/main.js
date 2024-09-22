import './index.scss';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import useAuthStore from './stores/auth.js';
import FriendQuery from '@/components/account/FriendQuery.vue';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.loadStateFromLocalStorage();

app.component('FriendQuery', FriendQuery);


app.mount('#app');