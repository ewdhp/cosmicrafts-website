<template>
  <div>
    <!-- Image that shows the currently selected avatar -->
    <img :src="selectedAvatar" alt="Selected Avatar" class="selected-avatar" @click="toggleGrid" />
    
    <transition name="fade">
      <!-- Use teleport to move the overlay to the root of the document -->
      <teleport to="body">
        <div v-if="showGrid" class="overlay">
          <div class="avatar-grid">
            <div v-for="(avatar, index) in avatarSrcArray" :key="index" @click="selectAvatar(index)">
              <img :src="avatar" alt="Avatar" class="avatar-image" />
            </div>
          </div>
        </div>
      </teleport>
    </transition>
  </div>
</template>

<script>
import avatar1 from '@/assets/avatars/Avatar_01.jpg';
import avatar2 from '@/assets/avatars/Avatar_02.jpg';
import avatar3 from '@/assets/avatars/Avatar_03.jpg';
import avatar4 from '@/assets/avatars/Avatar_04.jpg';
import avatar5 from '@/assets/avatars/Avatar_05.jpg';
import avatar6 from '@/assets/avatars/Avatar_06.jpg';
import avatar7 from '@/assets/avatars/Avatar_07.jpg';
import avatar8 from '@/assets/avatars/Avatar_08.jpg';
import avatar9 from '@/assets/avatars/Avatar_09.jpg';
import avatar10 from '@/assets/avatars/Avatar_10.jpg';
import avatar11 from '@/assets/avatars/Avatar_11.jpg';
import avatar12 from '@/assets/avatars/Avatar_12.jpg';

export default {
  data() {
    return {
      showGrid: false,
      selectedAvatarIndex: 0,
      avatarSrcArray: [
        avatar1,
        avatar2,
        avatar3,
        avatar4,
        avatar5,
        avatar6,
        avatar7,
        avatar8,
        avatar9,
        avatar10,
        avatar11,
        avatar12,
      ]
    };
  },
  computed: {
    selectedAvatar() {
      return this.avatarSrcArray[this.selectedAvatarIndex];
    }
  },
  methods: {
    toggleGrid() {
      this.showGrid = !this.showGrid;
    },
    selectAvatar(index) {
      this.selectedAvatarIndex = index; // Update the selected avatar index
      this.showGrid = false; // Hide the grid after selection
      this.$emit('avatar-selected', index); // Emit the selected avatar index to the parent component
    }
  }
};
</script>

<style scoped>
.selected-avatar {
  width: 150px;
  height: 150px;
  cursor: pointer;
  border: 2px solid #00FFFF;
  border-radius: 8px;

}

.overlay {
  position: fixed; /* Fixed to the viewport */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); /* Dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Ensure it appears on top */
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
  background: linear-gradient(125deg, #040f2451, #073e6170); /* Same gradient as register-panel */
  backdrop-filter: blur(4px); /* Same blur effect */
  border-radius: 10px;
  border: 0.5px solid rgba(255, 255, 255, 0.25); /* Subtle white border */
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.2); /* Inner shadow */
  max-width: 600px;
  width: 100%;
  z-index: 1001; /* Ensure it's above the overlay */
}

.avatar-image {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 5px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
