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




  .layout-container {
    display: flex;
    flex-grow: 1;
    margin-top: 6vh; /* Ensure the content starts after the header */
    padding: 16px; /* Add padding to avoid overlapping the edge */
    background-image: url('@/assets/login/fondo.jpg');

  }
}

.header {
  width: 97.5%; /* Limit the width to 90% of the viewport */
  height: 8vh;
  display: flex;
  justify-content: space-between;
  background: rgb(23, 28, 37);
  padding: 1px;
  position: fixed;
  top: 12px; /* Lower it by 25px from the top of the viewport */
  left: 50%; /* Move it 50% from the left */
  transform: translateX(-50%); /* Center it horizontally */
  z-index: 10;
  border: 0.25px solid rgba(255, 255, 255, 0.086); /* White stroke with 0.25px width and 25% opacity */
  border-radius: 10px; /* Round the edges with 10px radius */
  backdrop-filter: blur(15px); /* Keep the blurring effect */
  
  .link-nav {
    display: flex;
    margin-left: 24px;
    align-items: center; 
    

    img {  // Target the img tag within .link-nav
        width: 96px;
    }
}

  .account-nav {
    display: flex;
    align-items: center;
  }
}

.left-panel {
  width: 4%; /* Fixed width */
  padding: 16px;
  display: flex;
  flex-direction: column;
  position: absolute; /* Use absolute positioning for dynamic content height */
  top: 12%; /* Maximum top margin of 12% */
  bottom: 12%; /* Maximum bottom margin of 12% */
  left: 12px; /* Left offset */
  margin: auto 0; /* Center vertically by distributing remaining space as margin */
  background: linear-gradient(to bottom, rgba(101, 153, 201, 0.2), rgba(50, 76, 99, 0.2)); /* 20% opacity gradient */
  border: 0.25px solid rgba(255, 255, 255, 0.086); /* White stroke with 0.25px width and 25% opacity */
  border-radius: 10px; /* Round the edges with 10px radius */
  backdrop-filter: blur(15px); /* Blurring effect */
  max-height: calc(100% - 24%); /* Ensure maximum height takes into account 12% margin on top and bottom */
  overflow-y: auto; /* Make it scrollable if content overflows */
}


.content-panel {
  flex-grow: 1;
  margin-left: 9vw; /* Space for the left panel */
  margin-right: 10px; /* Space for the right panel */
  padding: 20px;
 
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