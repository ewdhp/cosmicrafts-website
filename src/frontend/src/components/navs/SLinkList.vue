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
  border: .25px solid rgb(255, 255, 255);
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
  transform: scale(1.1);
  transition: background 0.4s ease-in-out, border 0.25s ease-in-out, box-shadow 0.5s ease-in-out, transform 0.1s ease-in-out;
}

/* SVG Animation when switch to active */
.link-list li.active .nav-icon {

  transition: background 0.4s ease-in-out, border 0.2s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out;
}

/* Button Animation when switch to active */
.link-list li.active .section {
  background: linear-gradient(to bottom, #00C0FC, #0039BA);
  border: 1px solid #00ffff88;
  box-shadow: 0 0 8px rgba(0, 225, 255, 0.498);
  transform: scale(1.05);
  transition: background 0.6s ease-in-out, border 0.2s ease-in-out, box-shadow 0.5s ease-in-out, transform 0.25s ease-in-out;
}

/* Default inactive state */
.link-list li .section {
  
  background: linear-gradient(to bottom, #292c3729, #0c0f1684);
  border: .5px solid #ffffff2e;
  box-shadow: 0 4px 2px brgba(0, 0, 0, 0.139);
  transition: background 0.6s ease-in-out, border 0.25s ease-in-out, box-shadow 0.5s ease-in-out, transform 0.25s ease-in-out;
  margin-bottom: 24px;
}

/* Hover state for non-active buttons */
.link-list li:not(.active):hover .section {
  background: linear-gradient(to bottom, #151927, #293547);
  border: 2px solid #41c79f;
  box-shadow: 0 0 16px cyan;
  transform: scale(1.05); /* Slightly bigger on hover */
  transition: background 0.4s ease-in-out, border 0.2s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out;
}

/* Ensure all buttons have the same base size */
.link-list li .section,
.link-list li.active .section,
.link-list li:not(.active):hover .section {
  width: 24px;
  height: 24px;
  
}

.link-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

/* Media query for screens below 768px */
@media (max-width: 1080px) {
  .nav-container {
    flex-direction: column;
    align-items: center;
  }

  .link-list {
    flex-direction: row;
    justify-content: center;
  }

  .link-list ul {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .link-list li {
    margin-bottom: 0;
    margin-right: 12px;
  }

  .link-list li:last-child {
    margin-right: 0;
  }
}
</style>
