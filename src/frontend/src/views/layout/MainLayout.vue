<script>
import { ref, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import navItems from '@/config/navigation.js';
import SLinkList from '@/components/navs/SLinkList.vue';
import AccountNav from '@/components/account/AccountMenu.vue';
import AccountSearch from '@/components/account/AccountSearch.vue';

export default {
  name: 'MainLayout',
  components: {
    SLinkList,
    AccountNav,
    AccountSearch
  },
  setup() {

    const route = useRoute();
    const routes = navItems[2].children;
    const currentSection = ref(null);
    const childNavItems = ref([]);

    const mainNavItems = computed(() =>
      routes.filter(
        item => item.path !== '/login' && 
        item.path !== '/register').map(item => 
        ({
          path: item.path,
          name: item.name,
          icons: item.icons
      }))
    );

    watchEffect(() => {     
      const matchingSection = routes.find(item => item.path === route.path);
      console.log("matchingSection: ", matchingSection);
      currentSection.value = matchingSection || routes.find(item => item.path === '/');
      childNavItems.value = currentSection.value?.children || [];
    });

    return {
      currentSection,
      childNavItems,
      mainNavItems
    };
  }
};
</script>

<template>
  <div id="app" class="app-container">

    <header class="header">
      <div class="link-nav">
        <img src="@/assets/logos/logo_menu.svg" alt="Logo" class="logo-menu" />
      </div>
      <div class="account-nav">
        <AccountSearch />
        <AccountNav />
      </div>
    </header>

    <div class="layout-container">
      <aside class="left-panel">
        <div class="nav-wrapper">
          <SLinkList :items="mainNavItems" />
        </div>
      </aside>

      <main class="content-panel">
        <router-view />
      </main>

      <aside class="right-panel">
        <div class="right-menu minimized">
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('@/assets/OIG3.jpg');


  .layout-container {
    display: flex;
    flex-grow: 1;
    margin-top: 10vh; /* Ensure the content starts after the header */
    padding: 16px; /* Add padding to avoid overlapping the edge */
    background: #11214d71;

  }
}

  .header {
  width: 100%;
  height: 8vh;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(21, 25, 39, 0.493), rgba(23, 28, 43, 0.452));
  padding: 4px;
  position: fixed;
  z-index: 10;
  border-bottom: 3px solid #000000;
  box-shadow: inset 0px 2px 12px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px); /* Add blurring effect */



  .link-nav {
    display: flex;
    padding: 5px;
    margin-left: 10px;
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
  margin-left: 9vw; /* Space for the left panel */
  margin-right: 10px; /* Space for the right panel */
  padding: 20px;
  background: rgba(9, 15, 29, 0.856); /* Vertical gradient */
  color: #9ca3b8; /* Text color */
  border: 1px solid #828c9e;
  border-radius: 20px; /* Rounded corners */
  box-shadow: 8px 8px 8px rgba(0, 0, 1, 0.25), inset 0px 2px 6px rgba(255, 255, 255, 0.05); /* Outer and inner shadows */
  //overflow-y: auto; /* Scrollable */
  backdrop-filter: blur(3px);
  position: relative; /* Needed for watermark positioning */
  z-index: 1; /* Ensure the content panel has a higher z-index */

  &::before {
    content: '';
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