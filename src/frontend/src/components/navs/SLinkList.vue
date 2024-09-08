<template>
  <div class="nav-container">
    <div :class="['nav-sections', 'link-list', orientationClass]">
      <ul>
        <li
          v-for="item in items"
          :key="item.path"
          :class="{ active: isActive(item.path) }"
          @mouseenter="hoveredItem = item.path"
          @mouseleave="hoveredItem = null"
        >
          <RouterLink :to="item.path">
            <div class="section">
              <img
                v-if="getIcon(item)"
                :src="getIcon(item)"
                alt="icon"
                class="nav-icon"
              />
            </div>
          </RouterLink>
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
          item => 'name' in item && 'path' in item && 'icons' in item
        );
      }
    }
  },
  data() {
    return {
      activeLink: this.$route.path,
      hoveredItem: null
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
    },
    getIcon(item) {
      if (item.icons) {
        if (this.isActive(item.path)) {
          return item.icons.active;
        } else if (this.hoveredItem === item.path) {
          return item.icons.hover;
        } else {
          return item.icons.inactive;
        }
      }
      return null;
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
  justify-content: center;
}

.section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  /* Ensure smooth transition for all properties */
  transition: background 0.4s ease-in-out, border 0.2s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out;
  margin-bottom: 12px;
}

.nav-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease-in-out; /* Consistent transition for icon scaling */
}

/* Scaling the SVG only on hover */
.link-list li:not(.active):hover .nav-icon {
  transform: scale(1.25);
  transition: background 0.4s ease-in-out, border 0.25s ease-in-out, box-shadow 0.5s ease-in-out, transform 0.1s ease-in-out;

}

/* SVG Animation when switch to active */
.link-list li.active .nav-icon {
  transform: scale(1.25);
  transition: background 0.4s ease-in-out, border 0.2s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out;
}

/* Button Animation when switch to active */
.link-list li.active .section {
  background: linear-gradient(to bottom, #00C0FC, #0039BA);
  border: 2px solid #00FFFF;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.457);
  transform: scale(1.1);
  transition: background 0.6s ease-in-out, border 0.2s ease-in-out, box-shadow 0.5s ease-in-out, transform 0.25s ease-in-out;
}

/* Default inactive state */
.link-list li .section {
  background: linear-gradient(to bottom, #151927, #171C2B);
  border: 2px solid #252C3F;
  box-shadow: 0 0 5px black;
  transition: background 0.6s ease-in-out, border 0.25s ease-in-out, box-shadow 0.5s ease-in-out, transform 0.25s ease-in-out;
}

/* Hover state for non-active buttons */
.link-list li:not(.active):hover .section {
  background: linear-gradient(to bottom, #151927, #293547);
  border: 2px solid #252C3F;
  box-shadow: 0 0 16px cyan;
  transform: scale(1.05); /* Slightly bigger on hover */
  transition: background 0.4s ease-in-out, border 0.2s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out;
}

/* Ensure all buttons have the same base size */
.link-list li .section,
.link-list li.active .section,
.link-list li:not(.active):hover .section {
  width: 48px;
  height: 48px;
}

.link-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
