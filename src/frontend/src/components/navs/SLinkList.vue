<template>
  <div  class="nav-container">   

    <div 
    :class="['nav-sections', 
    'link-list', 
    orientationClass
    ]">     
      <ul>
        <li v-for="item in items" :key="item.path"  
          :class="{ 
          active: isActive(item.path) }"
        >
          <router-link :to="item.path">
            <div class="section">
              <img class="section-content" :src="item.icon"/>
              <span class="section-content" >{{ item.name }}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </div> 
  </div>
</template>

<script>
export default {
  name: 'SLinkList',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (items) => {
        return items.every(
          item => 'name' in item && 
          'path' in item);
      }
    }
  },
  data() {
    return {
      activeLink: this.$route.path
    };
  },
  computed: {
    orientationClass() {
      return 'vertical';
    }
  },
  methods: {
    isActive(path) {
      return this.activeLink === path;
    }
  },
  watch: {
    $route(newRoute) {
      this.activeLink = newRoute.path;
    }
  },
  mounted() {
    this.activeLink = this.$route.path;
  }
};
</script>

<style scoped>
.nav-container {
  display: flex;

}
.section {
  display:flex;
  align-items: center;
    padding: 5px;
}
.section-content {
  margin-right: 5px;
}
.link-list ul {
  display: flex;
  flex-direction: column;
}

.link-list li.active {
  color: rgb(33, 95, 230);
}

.nav-sections {
  display: flex;
  border-radius: 5px;

}

.nav-sections ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.nav-sections li {
  display: flex;
  border: 1px solid black;

}

.nav-sections a {
  text-decoration: none;
  color: rgb(99, 99, 104);
}

.nav-sections a:hover {
  color: #111e66;
}

.nav-sections img {
  vertical-align: middle;
}

.nav-sections span {
  font-size: 12px;
}
</style>
