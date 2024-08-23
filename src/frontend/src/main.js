import './index.scss';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import useAuthStore from './stores/auth.js'; // Correct import for default export

import FriendQuery from '@/components/account/FriendQuery.vue';
const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();
authStore.initializeStore();

app.component('FriendQuery', FriendQuery);
app.mount('#app');


