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
        <img src="@/assets/logos/cosmicrafts.svg" alt="Logo" class="logo-menu" />
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
  background-image: url('@/assets/login/fondo.jpg');

  .layout-container {
    display: flex;
    flex-grow: 1;
    padding: 66px;
    background: linear-gradient(to bottom, rgba(38, 50, 60, 0.812), rgba(16, 26, 34, 0.958)); /* 20% opacity gradient */
  }
}

.header {
  width: 98%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(101, 153, 201, 0.2), rgba(50, 76, 99, 0.2)); /* 20% opacity gradient */
  padding: 1px;
  position: fixed;
  top: 12px; /* Lower it by 12px from the top of the viewport */
  left: 50%; /* Move it 50% from the left */
  transform: translateX(-50%); /* Center it horizontally */
  z-index: 10;
  border: 0.25px solid rgba(255, 255, 255, 0.086); /* White stroke with 0.25px width and 25% opacity */
  border-radius: 10px; /* Round the edges with 10px radius */
  backdrop-filter: blur(12px); /* Keep the blurring effect */
}

.link-nav {
  display: flex;
  margin-left: 12px;
  align-items: center;

  img {
    width: 42px;
  }
}

.account-nav {
  display: flex;
  align-items: center;
  width: 100%;
}


.left-panel {
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 96px;
  left: 12px;
  background: linear-gradient(to bottom, rgba(101, 153, 201, 0.2), rgba(50, 76, 99, 0.2));
  border: 0.25px solid rgba(255, 255, 255, 0.086);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.content-panel {
  flex-grow: 0;
  margin-left: 9vw;
  margin-right: 10px;
  padding: 20px;

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


/* Media query for screens below 1080px */
@media (max-width: 1080px) {
  .layout-container {
    flex-direction: column;
    padding: 16px;
  }

  .header {
  width: 95%;

  }

  .left-panel {
    top: 92%;
    width: auto;
    height: 64px;
    position: fixed;
    bottom: 0;
    flex-direction: row;
    justify-content: space-around;
    padding: 8px;
    max-height: none;
    border-radius: 16px;
    border-top: 0.25px solid rgba(255, 255, 255, 0.086);
    border-left: none;
    border-right: none;

  left: 0;
  right: 0;
  
  margin-left: auto;
  margin-right: auto;
  }

  .content-panel {
    margin-left: 0;
    margin-right: 0;
    padding: 16px;
  }

  .right-panel {
    display: none;
  }
}

@media (max-width: 480px) {
  .search {
    max-width: 65%; /* Even larger for very small screens */
  }

  .header {

  display: flex;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(101, 153, 201, 0.2), rgba(50, 76, 99, 0.2)); /* 20% opacity gradient */
  position: fixed;
  top: 0px;
  border-bottom: 0.25px solid rgba(255, 255, 255, 0.086); /* White stroke with 0.25px width and 25% opacity */
  border-radius: 0px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  backdrop-filter: blur(12px); /* Keep the blurring effect */
  }

  .left-panel {
  top: 92%;
  width: 92%;
  margin-left: auto;
  margin-right: auto;
}

}
</style>
