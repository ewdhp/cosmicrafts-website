<script setup>

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LinkList from '@/components/navs/LinkList.vue';
import AccountNav from '@/components/account/AccountMenu.vue';
import AccountSearch from '@/components/account/AccountSearch.vue';


const linkMap = [
  { path: '/', name: "DashboardView" },
  { path: '/nfts', name: "NFTSView" },
  { path: '/tokens', name: "TokensView" },
  { path: '/referrals', name: "ReferralsView" },
  { path: '/statistics', name: "StatisticsView" },
  { path: '/tourneys', name: "TourneysView" }

];

const route = useRoute();
const items = computed(() => {
  let matchedPath = Object.keys(linkMap).find(
    path => path === route.path ||
      route.path.startsWith(path + '/'));
  return linkMap[matchedPath] || [];
});

const title = computed(() => {
  const currentPath = route.path;
  const item = items.value.find(item => item.path === currentPath);
  return item ? item.name : 'Default';
});
const orientation = 'horizontal';
</script>

<template>
  <div class="dashboard-container">
    <aside class="left-panel">
      <div class="nav-wrapper">
        <nav class="nav-sections">
          <ul>
            <li>
              <router-link to="/">
                <div class="nav-item">
                  <img width="85px" height="85px" src="@/assets/logos/cosmicrafts.svg" alt="Logo Icon" />
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/nfts">
                <div class="nav-item">
                  Tokens & Nfts
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/referrals">
                <div class="nav-item">
                  Referrals
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/statistics">
                <div class="nav-item">
                  Statistics
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/tokens">
                <div class="nav-item">
                  Tokens
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/tourneys">
                <div class="nav-item">
                  Tourneys
                </div>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
    <div class="right-panel">
      <header class="top-nav">
        <LinkList :items="items" :orientation="orientation" :title="title" />
        <div class="nav-right">
          <div style="border:1px solid;">
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
  border-right: 1px solid #888a8a;
  background-color: #f3f5f7;
  width: 150px;

  .nav-wrapper {
    display: flex;
  }

  .nav-sections {

    padding: 2px;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {

        a {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .nav-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          margin-left: 20px;

          img {

            display: flex;
          }

          span {
            font-size: 16px;
            color: #292929
          }

          &:hover {}
        }
      }
    }
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
