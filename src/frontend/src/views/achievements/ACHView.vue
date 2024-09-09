<template>
  <div class="ach-view">
    <div class="title"><h2>Achievements</h2></div>
    <div class="nav">

    <div class="categories">
      <button
        v-for="category in achStore.categories"
        :key="category.id"
        @click="selectCategory(category.id)"
        :class="{ active: selectedCategory && selectedCategory.value === category.id }"
      >
        <h3>{{ category.name }}</h3>
      </button>
    </div>
    </div>
    <div class="content" v-if="selectedCategory">
      <ACHList
        :items="filteredLines"
        :selectedItem="selectedLine"
        @update:selectedItem="selectLine"
      />
      <div class="individuals">
        <div v-for="individual in filteredIndividuals" :key="individual.id" class="card">
          <h3>{{ individual.name }}</h3>
          <p>{{ individual.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useACHStore } from '@/stores/ach.js';
import ACHList from '@/components/navs/ACHList.vue';

export default {
  components: {
    ACHList
  },
  setup() {
    const achStore = useACHStore();
    const selectedCategory = ref(null);
    const selectedLine = ref(null);
    const loading = ref(true);

    const selectCategory = (categoryId) => {
      console.log(`selectCategory called with categoryId: ${categoryId}`);
      selectedCategory.value = categoryId;
      selectedLine.value = null;
    };

    const selectLine = (lineId) => {
      console.log(`selectLine called with lineId: ${lineId}`);
      selectedLine.value = lineId;
    };

    const filteredLines = computed(() => {
      console.log(`filteredLines computed with selectedCategory: ${selectedCategory.value}`);
      if (!selectedCategory.value) return [];
      return achStore.lines.filter(line => line.categoryId === selectedCategory.value);
    });

    const filteredIndividuals = computed(() => {
      console.log(`filteredIndividuals computed with selectedLine: ${selectedLine.value}`);
      if (!selectedLine.value) return [];
      return achStore.individual.filter(achievement => achievement.achievementId === selectedLine.value);
    });

    onMounted(async () => {
      await achStore.fetchAchievements();
      if (achStore.categories.length > 0) {
        selectedCategory.value = achStore.categories[0].id;
      }
      loading.value = false;
    });

    return {
      achStore,
      selectedCategory,
      selectedLine,
      selectCategory,
      selectLine,
      filteredLines,
      filteredIndividuals,
      loading
    };
  }
};
</script>

<style scoped>
.nav {
  display: flex;
  flex-direction: row;
}
h2 {
  color:#f8f4f4;
  margin:0px;
  padding: 0px;
}
.ach-view {
  padding: 20px;
}

.categories {
  display: flex;
  margin-bottom: 10px;
  width:100%;
  justify-content: flex-end;
  align-items:end;
}

.categories button {
  background: none;
  border: none;
  color:rgb(242, 243, 247);
  font: inherit;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
}

.categories button:hover {
  text-decoration: underline;
}

.categories button.active {
  font-weight: bold;
  text-decoration: underline;
  color: blue; /* Change color to indicate active state */
}

.content {
  display: flex;
}

.individuals {
  flex: 3;
  color:rgb(216, 225, 253);
}

.card {
  border: .5px solid #77a7e6;
  background-color: rgba(11, 16, 29, 0.945);
  padding: 20px;
  margin-bottom: 20px;
}
</style>