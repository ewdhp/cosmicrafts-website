<template>
  <div>
    <button @click="showGrid = true">Select Avatar</button>
    <transition name="fade">
      <div v-if="showGrid" class="avatar-grid">
        <div v-for="(src, index) in avatarSrcArray" :key="index" class="avatar-item">
          <img :src="src" :alt="'Avatar ' + index" @click="selectAvatar(index)" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    avatarSrcArray: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showGrid: false
    };
  },
  methods: {
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
.avatar-item img {
  width: 100%;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.2s;
}
.avatar-item img:hover {
  transform: scale(1.1);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
