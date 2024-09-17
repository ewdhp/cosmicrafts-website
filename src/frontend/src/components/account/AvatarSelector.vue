<template>
  <div>
    <!-- Image that shows the currently selected avatar -->
    <img :src="selectedAvatar" alt="Selected Avatar" class="selected-avatar" @click="toggleGrid" />

    <transition name="fade">
      <!-- Use teleport to move the overlay to the root of the document -->
      <teleport to="body">
        <div v-if="showGrid" class="overlay" @click.self="closeGrid">
          <!-- Projected Image Section (outside the panel) -->
          <div v-if="hoveredAvatar" class="avatar-projection">
            <img :src="hoveredAvatar" alt="Projected Avatar" class="projected-avatar" />
          </div>

          <!-- Avatar Grid Container (Panel) -->
          <div class="avatar-grid-container">
            <!-- SVG Icon and Title for avatar selection grid -->
            <div class="avatar-grid-header">
              <img src="@/assets/icons/avatar_icon.svg" alt="Avatar Icon" class="avatar-icon" />
              <h2 class="avatar-grid-title">Select Your Avatar</h2>
            </div>

            <div class="outer-panel">
              <!-- Avatar Grid -->
              <div class="avatar-grid">
                <div v-for="(avatar, index) in avatarSrcArray" 
                     :key="index" 
                     @mouseover="hoverAvatar(avatar)" 
                     @mouseleave="clearHoveredAvatar"
                     @click="selectAvatar(index)" 
                     class="avatar-item">
                  <img :src="avatar" alt="Avatar" class="avatar-image" />
                </div>
              </div>
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
      hoveredAvatar: null, // Store the hovered avatar
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
    },
    closeGrid() {
      this.showGrid = false; // Close the avatar grid without any changes
    },
    hoverAvatar(avatar) {
      this.hoveredAvatar = avatar; // Update the hovered avatar
    },
    clearHoveredAvatar() {
      this.hoveredAvatar = null; // Clear the hovered avatar when the mouse leaves
    }
  }
};
</script>


<style scoped>
/* Styling for the selected avatar */
.selected-avatar {
  width: 128px;
  height: 128px;
  cursor: pointer;
  border: 1px solid #00FFFF;
  border-radius: 8px;
}

/* Overlay that appears when selecting an avatar */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

/* Outer panel with black background and transparency */
.outer-panel {
  background: rgba(0, 0, 0, 0.128); /* Transparent black background */
  padding: 20px;
  border-radius: 10px; /* Rounded corners */
  justify-content: center;
  align-items: center;
  border: .025px solid #6c6c6c3b;
  position: relative;
  z-index: 3; /* Panel is on top */
}

/* Avatar grid container styling */
.avatar-grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #16212bc6;
  backdrop-filter: blur(4px);
  padding: 36px;
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.077);
  box-shadow: inset 0px 0px 10px rgba(156, 156, 156, 0.068);
}

/* Avatar grid header with SVG icon and title */
.avatar-grid-header {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px; /* Space between title and grid */
  margin-left: 20px; /* Align with outer-panel padding */
}

/* SVG icon before title */
.avatar-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px; /* Space between icon and title */
}

/* Title for avatar selection grid */
.avatar-grid-title {
  color: #d8e7ee;
  font-size: 18px;
  font-weight: 900;
  text-align: left;
}

/* Avatar grid layout */
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

/* Avatar item styling */
.avatar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

/* Styling for the avatar images */
.avatar-image {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #00FFFF;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

/* Glow and elastic hover animation */
.avatar-item:hover .avatar-image {
  animation: elasticScale 0.45s ease-in-out;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5),
              0 0 20px rgba(0, 255, 255, 0.3);
  filter: brightness(1.2);
}

/* Keyframe for elastic animation */
@keyframes elasticScale {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(0.95);
  }
  80% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Projected avatar image */
.avatar-projection {
  position: fixed; /* Fixed to viewport */
  top: 0;
  left: 0;
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
  opacity: 0.625; /* Transparency level */
  z-index: -1; /* Lower than the outer panel */
  pointer-events: none; /* Prevent the projection from blocking clicks */
}

.projected-avatar {
  width: 100vw; /* Full width */
  height: 100vh; /* Full height */
  object-fit: cover; /* Ensure the image scales properly */
  opacity: 0.1; /* Adjust transparency */
  animation: projectIn 0.25s ease forwards;
  pointer-events: none; /* Prevent the image from blocking clicks */
}

/* Keyframes for projecting the avatar */
@keyframes projectIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.25;
  }
}

/* Transition effects */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
