<template>
  <div  class="nav-container">   
    <span class="nav-title">{{ title }}</span>
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
            <div>
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
    },
    orientation: {
      type: String,
      default: 'horizontal',
      validator: (value) => 
      ['vertical', 'horizontal']
      .includes(value)
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
  flex-direction: column;
  margin: 15px;

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

.link-list.horizontal ul {
  flex-direction: row;
}

.link-list li.active {
  border-bottom: 5px solid rgb(36, 36, 37);
}

.nav-sections {
  display: flex;
  align-items: first baseline;
  border-radius: 5px;
    padding-top: 15px;
}

.nav-sections ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.nav-sections li {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  align-items: baseline;
 
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
