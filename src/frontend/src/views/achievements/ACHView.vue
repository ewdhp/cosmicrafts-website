<template>
  <h2>Achievements</h2>
  <div>
    <ul>
      <li v-for="category in achStore.categories" :key="category.id">
        <a href="#" @click.prevent="selectCategory(category.id)">{{ category.name }}</a>
      </li>
    </ul>
    <ul v-if="selectedCategory">
      <li v-for="line in getChildren(selectedCategory, 'category')" :key="line.id">
        <a href="#" @click.prevent="selectLine(line.id)">{{ line.name }}</a>
      </li>
    </ul>
    <ul v-if="selectedLine">
      <li v-for="individual in getChildren(selectedLine, 'line')" :key="individual.id">
        {{ individual.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useACHStore } from '@/stores/ach.js';

const achStore = useACHStore();
const selectedCategory = ref(null);
const selectedLine = ref(null);
const loading = ref(true);

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  selectedLine.value = null; // Reset selected line when a new category is selected
};

const selectLine = (lineId) => {
  selectedLine.value = lineId;
};

const getChildren = (id, type) => {
  if (type === 'category') {
    return achStore.lines.filter(line => line.categoryId === id);
  }
  if (type === 'line') {
    return achStore.individual.filter(achievement => achievement.achievementId === id);
  }
  return [];
};

onMounted(async () => {
  await achStore.fetchAchievements();
  loading.value = false;
});
</script>

<style scoped>
h2 {
  color: #a8b3bd;
  padding: 0px;
  margin: 0px;
  margin-bottom: 1em;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0.5em 0;
}
a {
  cursor: pointer;
  color: #54b2f1;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>