<template>
  <div class="top-section">
    <div class="collection-metadata">
      <img src="@/assets/logos/cosmicrafts.svg" alt="Logo" class="logo-menu" />
      <div class="metadata-info">
        <h2>{{ collection.name || 'Unknown Collection' }}</h2>
        <p>{{ collection.description ? collection.description[0] : 'No description available.' }}</p>
        <div class="metadata-stats">
          <div>Total Supply: {{ collection.totalSupply || 0 }}</div>
          <div>Royalty Fees: {{ collection.royalties || 'N/A' }}</div>
          <div>Chain: IC</div>
          <span style="margin-right: 10px; min-width: 120px;">NFTs Owned: {{ nftsOwned }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="controls">
    <div style="display:flex; flex-direction:row;">
      <button  @click="setLayout('horizontal')" aria-label="Horizontal View">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="8" height="8" fill="currentColor" />
        <rect x="13" y="3" width="8" height="8" fill="currentColor" />
        <rect x="3" y="13" width="8" height="8" fill="currentColor" />
        <rect x="13" y="13" width="8" height="8" fill="currentColor" />
      </svg>
    </button>
    <button @click="setLayout('vertical')" aria-label="Vertical View">
      <svg  width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="4" fill="currentColor" />
        <rect x="3" y="10" width="18" height="4" fill="currentColor" />
        <rect x="3" y="17" width="18" height="4" fill="currentColor" />
      </svg>
    </button></div>
    
   
   

    <select style="margin-right: 5px;" v-model="selectedCategory" @change="filterNFTs">
      <option v-for="(displayName, category) in categories" :key="category" :value="category">{{ displayName }}</option>
    </select>
    <input style="margin-right: 10px;width:6100%;" type="text" v-model="searchQuery" placeholder="Search by name or id" @input="filterNFTs" />
  
  </div>
<br>_________________________________________
  <div :class="['nft-display', layout]">
    <div v-if="filteredNFTs.length === 0">No NFTs found.</div>
    <NftItem v-for="nft in filteredNFTs" :key="nft.tokenId" :nft="nft" :layout="layout" />
  </div>
</template>

<script>
import { useNftsStore } from '@/stores/nfts';
import NftItem from '@/components/nfts/CompactMD.vue';

export default {
  components: {
    NftItem
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      nftsOwned: 0,
      layout: 'vertical', // Default layout
      categories: {
        all: 'All'
      },
      mockNfts: [],
      collection: {}
    };
  },
  computed: {
    filteredNFTs() {
      return this.mockNfts.filter(nft => {
        const matchesCategory = this.selectedCategory === 'all' || nft.category === this.selectedCategory;
        const matchesQuery = nft.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      });
    },
    nftsOwned() {
      return this.mockNfts.length;
    }
  },
  created() {
    this.initializeMockNfts();
    this.setCategories();
  },
  mounted() {
    this.fetchCollection();
  },
  methods: {
    async fetchCollection() {
      const nftsStore = useNftsStore();
      await nftsStore.fetchCollection();
      this.collection = nftsStore.collection;
    },
    initializeMockNfts() {
      this.mockNfts = [
        { tokenId: 1, name: 'Art NFT 1', category: 'art' },
        { tokenId: 2, name: 'Music NFT 1', category: 'music' },
        { tokenId: 3, name: 'Game NFT 1', category: 'games' },
        { tokenId: 4, name: 'Art NFT 2', category: 'art' },
      ];
    },
    setCategories() {
      const categoriesSet = new Set(this.mockNfts.map(nft => nft.category));
      this.categories = {
        all: 'All',
        ...Object.fromEntries([...categoriesSet].map(category => [category, category.charAt(0).toUpperCase() + category.slice(1)]))
      };
    },
    filterNFTs() {
      // This method is now only needed to trigger reactivity
    },
    setLayout(layout) {
      this.layout = layout;
    }
  }
};
</script>

<style scoped>
/* Define keyframes for the color transition */
@keyframes colorTransition {
  0% {
    background-color: rgba(1, 8, 20, 0.678);
  }
  25% {
    background-color: rgba(15, 8, 43, 0.267);
  }
  50% {
    background-color: rgba(10, 8, 24, 0.774);
  }
  75% {
    background-color: rgba(12, 12, 12, 0.753);
  }
  100% {
    background-color: rgba(1, 7, 17, 0.877);
  }
}

body {
  font-family: Arial, sans-serif;

}

.controls {
  display: flex;
  padding: 0;
  margin-top: 30px;
  height: 45px;
  color: rgb(255, 255, 255);
  width: 100%;
}

input {
  background-color: rgba(214, 220, 224, 0.993);
  padding: 10px;
  margin-left: 10px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  max-width: 44%;
}

select {
  height: 45px;
  width: 75px;
  background-color: rgba(10, 18, 31, 0);
  border: none;
  color: rgb(255, 255, 255);
  backdrop-filter: blur(20px);
}

button {
  width: 50px;
  background-color: rgba(10, 18, 31, 0);
  border: none;
  color: rgb(255, 255, 255);
  backdrop-filter: blur(20px);
}

.top-section {
  display: flex;
  height: 235px;

  align-items: center;
  border: 1px solid #5b5c5e;
  border-radius: 10px;
  background-color: rgba(4, 8, 17, 0.623);
  color: rgb(158, 160, 161);
  backdrop-filter: blur(30px); /* Apply blur effect */
  overflow: hidden; /* Ensure content does not overflow */
  box-sizing: border-box; /* Include padding in the element's total width and height */
  animation: colorTransition 7s infinite; /* Apply the color transition animation */
}

.collection-metadata {
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* Allow content to wrap within the container */
  margin-right: 20px;
  margin-left: 20px;
}

.collection-metadata img {
  width: 100px;
  height: 100px;
  margin-right: 20px;

}

.metadata-info {
  display: flex;
  flex-direction: column;
  flex: 1; /* Allow metadata info to take available space */
  min-width: 0; /* Prevent overflow due to long text */
}

.metadata-stats {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Ensure stats take full width */
  flex-wrap: wrap; /* Allow stats to wrap within the container */
}

.nft-display {
  display: flex;
  flex-wrap: wrap;
  overflow: auto; /* Ensure content is scrollable if it overflows */
  max-height: calc(100vh - 300px); /* Adjust height to fit within the viewport */
  align-items: center;
  align-content: center;
  margin-top: 10px;
  box-sizing: border-box; /* Ensure padding is included in the element's total width and height */
}

.nft-display.vertical .nft-item {
  display: flex;
  flex-direction: column;
}

.nft-display.horizontal .nft-item {
  display: flex;
  flex-direction: row;
}
</style>