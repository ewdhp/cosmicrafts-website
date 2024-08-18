<template>
  <div  class="nav-container">   

    <div 
    :class="['nav-sections', 
    'link-list', 
    orientationClass
    ]">     
      <ul>
        <li>
          <div class="row">
          <span class="nav-title">{{ title }}</span>
          </div>
        </li>
        <li v-for="item in items" :key="item.path"  
          :class="{ 
          active: isActive(item.path) }"
        >
          <router-link :to="item.path">
            <div class="row">
              <img :src="item.icon"/>
              <span>{{ item.name }}</span>
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
    },
    title: {
      type: String,
      default: 'Default'
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
.nav-title {
  font-size: 18px;
  color: rgb(20, 20, 20);
  font-weight: bold;
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
.row {
   display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px;
}
.row img {
  margin-right: 8px; /* Adjust the value to increase or decrease the space */
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
