<template>
  <div class="top-section">
    <div class="collection-metadata">     
      <div class="metadata-info">      
        <div class="controls">
          <div style="display:flex;justify-content: flex-start; margin:10px; width:100%;">
            <img style="display: flex;  margin-right:15px" src="@/assets/logos/cosmicrafts.svg" alt="Logo" class="logo-menu" />
            <h2 style="display: flex;  min-width: 230px;">{{ collection.name || 'Unknown Collection' }}</h2>
          </div>
    
          <div style="display:flex;justify-content: flex-end; margin:0px; width:100%;">
            <select v-model="selectedCategory" @change="filterNFTs">
              <option v-for="(displayName, category) in categories" :key="category" :value="category">{{ displayName }}</option>
            </select>
            <input style="display: flex; min-width:200px; width:100%;" type="text" v-model="searchQuery" placeholder="Search NFTs" @input="filterNFTs" /> 
            
          </div>
        </div>
        <div style="display: flex; flex-direction:column; align-items: center; margin: 0px 30px 15px 40px;">
          <p>{{ collection.description ? collection.description[0] : 'No description available.' }}</p>
          <div style="display:flex; flex-direction: row; color:rgb(11, 182, 235);" class="metadata-stats">
            <div>Total Supply: {{ collection.totalSupply || 0 }}</div>
            <div>Total Supply: {{ collection.totalSupply || 0 }}</div>
            <div>Royalty Fees: {{ collection.royalties || 'N/A' }}</div>
            <div>Chain: IC</div>
            <span style="min-width: 120px;">NFTs Owned: {{ nftsOwned }}</span>
          </div>

          <div class="nft-display">
    <div v-if="filteredNFTs.length === 0">No NFTs found.</div>
    <NftItem v-for="nft in filteredNFTs" :key="nft.tokenId" :nft="nft"  />
  </div>
        </div> 
      </div>
    </div>
    
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
      nftsOwned: 0, // Default layout
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
    initializeMockNfts() { //this is a test because no nfts are fetched
      this.mockNfts = [
        { tokenId: 1, name: 'Art NFT', category: 'art' },
        { tokenId: 2, name: 'Music NFT', category: 'music' },
        { tokenId: 3, name: 'Game NFT', category: 'games' },
        { tokenId: 4, name: 'Art NFT', category: 'art' },
        { tokenId: 5, name: 'Art NFT', category: 'art' },
        { tokenId: 6, name: 'Music NFT', category: 'music' },
        { tokenId: 7, name: 'Game NFT', category: 'games' },
        { tokenId: 8, name: 'Art NFT', category: 'art' },
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

@keyframes colorTransition {
  0% {
    background-color: rgba(6, 8, 10, 0.678);
  }
  25% {
    background-color: rgba(12, 3, 37, 0.61);
  }
  50% {
    background-color: rgba(5, 15, 58, 0.527);
  }
  75% {
    background-color: rgba(6, 39, 82, 0.548);
  }
  100% {
    background-color: rgba(6, 8, 10, 0.678);
  }
}

body {
  font-family: Arial, sans-serif;
}

.controls {
  display: flex;
  color: rgb(236, 238, 243);
  overflow: hidden;
}

input {
  background-color: rgba(237, 241, 243, 0.993);
  padding: 10px;
  margin: 25px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  height: 20px;
}

select {
  height: 45px;
  width: 75px;
  margin: 25px;
  background-color: rgba(10, 18, 31, 0);
  border: none;
  color: rgb(255, 255, 255);
  backdrop-filter: blur(20px);
}
select option {
  background-color: rgba(252, 253, 253, 0.925);
  border: none;
  color: rgb(21, 22, 22);
  backdrop-filter: blur(20px);
}

button {
  display: flex;
  background-color: rgba(10, 18, 31, 0);
  border: none;
  color: rgb(255, 255, 255);
  backdrop-filter: blur(20px);
}

.top-section {
  display: flex;
  border: 1px solid #9ea3b8;
  border-radius: 10px;
  background-color: rgb(23, 28, 37);
  color: rgb(223, 227, 230);
  backdrop-filter: blur(30px); 
  overflow: hidden;
  animation: colorTransition 18s infinite; 
}

.collection-metadata {
  display: flex;
}

.collection-metadata img {
}

.metadata-info {
  display: flex;
  flex-direction: column;
}

.metadata-stats {
  display: flex;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 10px;
}

.nft-display {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  color: #9ca3b8;
  margin-top: 20px;
  border-radius: 15px;
}

</style>