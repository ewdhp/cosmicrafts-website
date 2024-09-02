<!-- src/views/DashboardView.vue -->
<template>
    <div class="dashboard">
        <UserInfo />
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import UserInfo from '@/components/account/UserInfo.vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
    await authStore.logout();
    router.push({ path: '/login' });
};
</script>

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