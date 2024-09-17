<template>
  
  <div class="orientation link-list">
    <button
      v-for="item in items"
      :key="item.id"
      @click="selectItem(item.id)"
      :class="{ active: selectedItem === item.id }"
    >
      {{ item.name }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    selectedItem: {
      type: String,
      default: null
    }
  },
  methods: {
    selectItem(itemId) {
      this.$emit('update:selectedItem', itemId);
    }
  }
};
</script>

<style scoped>
.orientation {
  display: flex;
  flex-direction: row; /* Change to row for horizontal layout */

}
.link-list button {

  background-color:white;
  border: none;
  color: #c0c0c4;
  font: inherit;
  cursor: pointer;
  padding: 0;
  margin-right: 10px; /* Change to margin-right for horizontal spacing */
}


.link-list button.active {
  font-weight: bold;
  color: rgb(35, 74, 180);/* Change color to indicate active state */
}
</style>
