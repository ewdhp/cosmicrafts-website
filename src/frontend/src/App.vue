<script setup>
import LinkList from '@/components/navs/LinkList.vue';
import SLinkList from '@/components/navs/SLinkList.vue';
import AccountNav from '@/components/account/AccountMenu.vue';
import AccountSearch from '@/components/account/AccountSearch.vue';

import navItems from './config/navigation.js';
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from './stores/auth.js';
import { useRouter, useRoute } from 'vue-router';

import AvatarSelector from '@/components/account/AvatarSelector.vue';
import REGView from '@/views/account/REGView.vue';
import LoginView from '@/views/login/LoginView.vue';


const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const currentSection = ref(null);
const childNavItems = ref([]);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isRegistered = computed(() => authStore.isRegistered);

const logout = async () => {
  await authStore.logout();
  router.push({ path: '/login' });
};
const filteredNavItems = navItems.filter(item => item.path !== '/login' && item.path !== '/account/register');
const mainNavItems = computed(() =>
filteredNavItems.map(item => ({
    path: item.path,
    name: item.name,
    icons: item.icons
  }))
);


watchEffect(() => {
  console.log('Route:', route.path);
  const matchingSection = navItems.find(item => item.path === route.path);
  currentSection.value = matchingSection || navItems.find(item => item.path === '/'); // Default to the root if no match
  childNavItems.value = currentSection.value?.children || [];
});

/**
 * 
 * Remove login and register from the nav items
 * 
 * 
 * 
 */

</script>


<template>
  <div v-if="isAuthenticated == false">
    <LoginView />
  </div>

  <div v-else-if="isAuthenticated == true && isRegistered == false">
    <REGView />
  </div>

  <div v-else-if="isAuthenticated == true && isRegistered == true">
    <div id="app" class="app-container">
      <!-- Full-width header -->
      <header class="header">
        <div class="link-nav">
          <img src="@/assets/logos/logo_menu.svg" alt="Logo" class="logo-menu" />
          <LinkList :items="childNavItems" />
        </div>
        <div class="account-nav">
          <AccountSearch />
          <AccountNav />
        </div>
      </header>

      <!-- Main layout with left menu, middle content, and right-side menu -->
      <div class="layout-container">
        <!-- Left-side navigation panel -->
        <aside class="left-panel">
          <div class="nav-wrapper">
            <SLinkList :items="mainNavItems" />
          </div>
        </aside>

        <!-- Middle dynamic content panel -->
        <main class="content-panel">
          <RouterView />
        </main>

        <!-- Right-side secondary minimized menu -->
        <aside class="right-panel">
          <div class="right-menu minimized">
            <!-- Placeholder for minimized secondary features like chat, friends list -->
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to bottom, #171F2B, #16191F);
  
  .layout-container {
    display: flex;
    flex-grow: 1;
    margin-top: 10vh; /* Ensure the content starts after the header */
    padding: 16px; /* Add padding to avoid overlapping the edge */
  }
}

.header {
  width: 100%;
  height: 8vh;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(to bottom, #080A0D, #171D25);
  padding: 4px;
  position: fixed;
  z-index: 10;
  border-bottom: 0.5px solid #4F4F4F;
  box-shadow: inset 0px 2px 12px rgba(255, 255, 255, 0.1);
  
  .link-nav {
    display: flex;
    padding: 8px;
  }

  .account-nav {
    display: flex;
    align-items: center;
    padding: 8px 16px;
  }
}

.header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
  pointer-events: none;
}

.left-panel {
  width: 8%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 12vh;
  bottom: 0;
  left: 0;
}

.content-panel {
  flex-grow: 1;
  margin-left: 10%; /* Space for the left panel */
  margin-right: 20%; /* Space for the right panel */
  padding: 20px;
  background: linear-gradient(to bottom, #262A32, #202328); /* Vertical gradient */
  color: #79829B; /* Text color */
  border-radius: 20px; /* Rounded corners */
  box-shadow: 8px 8px 8px rgba(0, 0, 0.5, 0.25), inset 0px 2px 6px rgba(255, 255, 255, 0.05); /* Outer and inner shadows */
  //overflow-y: auto; /* Scrollable */
  position: relative; /* Needed for watermark positioning */
  z-index: 1; /* Ensure the content panel has a higher z-index */

  &::before {
  content: '';
  background: url('@/assets/logos/logo.svg') no-repeat center center;
  background-size: 100%;
  opacity: 0.015;
  position: absolute;
  width: 512px;
  height: 512px;
  top: 50%;
  right: 0;
  right: 12px;
  transform: translateY(-50%);
}
}

.right-panel {
  width: 20%;
  position: fixed;
  top: 12vh;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}

.right-menu.minimized {
  width: 5%;
  transition: width 0.3s ease;
}


</style>
