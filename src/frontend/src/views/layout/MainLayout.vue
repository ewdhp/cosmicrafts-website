<script>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import navItems from '@/config/navigation.js';
import SLinkList from '@/components/navs/SLinkList.vue';
import AccountNav from '@/components/account/AccountMenu.vue';
import AccountSearch from '@/components/account/AccountSearch.vue';
import { useCosmicraftsStore } from '@/stores/cosmicrafts.js';
import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';


export default {
  name: 'MainLayout',
  components: {
    SLinkList,
    AccountNav,
    AccountSearch,
  },
  setup() {

    const route = useRoute();
    const routes = navItems[2].children;
    const currentSection = ref(null);
    const childNavItems = ref([]);

    const cosmicrafts = ref({
      loading: true, // Initialize with a default loading state
    });
    onMounted(async () => {
      //const store = await useCosmicraftsStore();
      //cosmicrafts.value = store;
    });


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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  
}

.layout-container {
  display: absolute;
  width: 100vw;
  flex-direction: column;
}

.header {
  width: 98%;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(101, 153, 201, 0.2), rgba(50, 76, 99, 0.2)); /* 20% opacity gradient */
  padding: .25rem;
  position: fixed;
  top: 1rem;
  left: 50%; /* Move it 50% from the left */
  transform: translateX(-50%); /* Center it horizontally */
  z-index: 10;
  border: 0.25px solid rgba(255, 255, 255, 0.086);
  border-radius: 10px;
  backdrop-filter: blur(12px);
}

.link-nav {
  display: flex;
  margin-left: 1rem;
  align-items: center;

  img {
    width: 2.5rem;
  }
}

.account-nav {
  display: flex;
  align-items: center;
  width: 100%;
}


.left-panel {
  padding: .5rem;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 6rem;
  left: 1rem;
  background: linear-gradient(to bottom, rgba(101, 153, 201, 0.2), rgba(50, 76, 99, 0.2));
  border: 0.25px solid rgba(255, 255, 255, 0.086);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.content-panel {
  flex-grow: 1;
  margin: 0 2rem;
  padding: 2rem;
  margin-left: 4rem;
  margin-right: 0;
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

  .header {
  width: 95%;
  }

  .left-panel {
    top: 92%;
    width: auto;
    height: 4rem;
    position: fixed;
    bottom: 0;
    flex-direction: row;
    justify-content: space-around;
  padding: .5rem;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  border-radius: 0px; 
  }

  .content-panel {
    margin-left: 0;
    margin-right: 0;
    margin-top: 1rem;
    padding: .5rem;
  }

  .right-panel {
    display: none;
  }
}

</style>
