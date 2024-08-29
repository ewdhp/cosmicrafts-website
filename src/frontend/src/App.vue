<script setup>
import LinkList from '@/components/navs/LinkList.vue';
import SLinkList from '@/components/navs/SLinkList.vue';
import AccountNav from '@/components/account/AccountMenu.vue';
import AccountSearch from '@/components/account/AccountSearch.vue';
import LoginView from '@/views/login/LoginView.vue';
import navItems from './config/navigation.js';
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from './stores/auth.js';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const currentSection = ref(null);
const childNavItems = ref([]);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const logout = async () => {
  await authStore.logout();
  router.push({ path: '/login' });
};

const mainNavItems = computed(() =>
  navItems.map(item => ({
    path: item.path,
    name: item.name,
    icon: item.icon
  }))
);

watchEffect(() => {
  const matchingSection = navItems.find(item => item.path === route.path);
  currentSection.value = matchingSection || navItems.find(item => item.path === '/'); // Default to the root if no match
  childNavItems.value = currentSection.value?.children || [];
});
</script>

<template>
  <div id="app">
    <LoginView v-if="!isAuthenticated" />
    <div v-else class="dashboard-container">
      <aside class="left-panel">
        <div class="nav-wrapper">
          <SLinkList :items="mainNavItems" />
        </div>
      </aside>

      <div class="right-panel">
        <div class="nav-right">
          <div class="top-nav">
            <div class="link-nav">
              <LinkList :items="childNavItems" />
            </div>
            <div class="account-nav">
              <AccountSearch />
              <AccountNav />
            </div>
          </div>
        </div>

        <main class="main-content">
          <div>
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(to left, rgb(254, 254, 255), #fafbfc);
}

.left-panel {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #49d8d8;
  background-color: #f3f5f7;

  .nav-wrapper {
    display: flex;
  }
}

.right-panel {
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  .nav-right {
    display: flex;
    flex-direction: row;
    background-color: #f3f5f7;
    border: 1px solid black;
    padding: 5px;
  }

  .top-nav {
    display: flex;
    width: 100%;
  }

  .link-nav {
    display: flex;
    padding: 5px;
    border: 1px solid black;
  }

  .account-nav {
    display: flex;
    flex-direction: row;
    width: 100%;
    border: 1px solid black;
    justify-content: flex-end;
    padding: 5px;
  }

  .main-content {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    margin-top: 15px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
  }
}
</style>
