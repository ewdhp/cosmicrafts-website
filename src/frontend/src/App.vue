<script setup>

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LinkList from '@/components/navs/LinkList.vue';
import AccountNav from '@/components/account/AccountMenu.vue';
import AccountSearch from '@/components/account/AccountSearch.vue';
import SLinkList from '@/components/navs/SLinkList.vue';
import navItems from './config/navigation.js';


</script>

<template>
  <div class="dashboard-container">
    <aside class="left-panel">
      <div class="nav-wrapper">    
         <SLinkList :items="navItems.main" :title="mainTitle" />
      </div>
    </aside>
    <div class="right-panel">
      <header class="top-nav">
        <LinkList 
          :items="navItems.main" 
          :orientation="orientation" 
          :title="title" 
        />
        <div class="nav-right">
          <div>
            <AccountSearch />
          </div>
          <div>
            <AccountNav/>
          </div>
        </div>
      </header>
      <main class="main-content">
        <div>
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(to left,
      rgb(254, 254, 255),
      #fafbfc);
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

  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 15px;
    padding-right: 15px;
    padding-left: 20px;
    padding-bottom: 15px;
    background-color: #f3f5f7;
    border-bottom: 1px solid #888a8a;

  }

  .nav-right {
    display: flex;
    flex-direction: row;
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
