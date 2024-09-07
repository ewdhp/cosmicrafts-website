<!-- src/views/DashboardView.vue -->

<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
    await authStore.logout();
    router.push({ path: '/login' });
};
</script>

<template>
    <div class="dashboard">
        <button @click="logout">Logout</button>
    </div>
</template>

<style scoped>
.dashboard {
    padding: 20px;
}

nav {
    margin-top: 20px;
}

nav a {
    margin-right: 10px;
    text-decoration: none;
    color: blue;
}
</style>