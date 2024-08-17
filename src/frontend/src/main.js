import './index.scss';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import FriendQuery from '@/components/account/FriendQuery.vue';
const app = createApp(App);

app.use(createPinia());
app.use(router);

// Adjust the path as needed

app.component('FriendQuery', FriendQuery);
app.mount('#app');


