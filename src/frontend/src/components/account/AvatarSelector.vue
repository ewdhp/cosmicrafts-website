<template>
  <div>
    <button @click="toggleGrid">Toggle Avatar Grid</button>
    <transition name="fade">
      <div v-if="showGrid" class="avatar-grid">
        <div v-for="(avatar, index) in avatarSrcArray" :key="index" @click="selectAvatar(index)">
          <img :src="avatar" alt="Avatar" class="avatar-image"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import DashboardIcon from '@/assets/icons/dashboard.svg';

export default {
  data() {
    return {
      showGrid: false, // Set to false to hide the grid initially
      avatarSrcArray: [
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        DashboardIcon,
        // Add more avatar paths here
      ]
    };
  },
  methods: {
    toggleGrid() {
      this.showGrid = !this.showGrid;
    },
    selectAvatar(index) {
      this.$emit('avatar-selected', index);
      this.showGrid = false;
    }
  }
};
</script>

<style scoped>
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.avatar-image {
  width: 100%;
  height: auto;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>