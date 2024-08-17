<template>
  <div>
    <input v-model="query" @input="handleInput" />
    <ul v-if="results.length > 0" :key="results.length">
  <li v-for="(result, index) in results" :key="index">
    <FriendQuery :avatarUrl="result.avatarUrl" :name="result.playerName" />
  </li>
</ul>
    <p v-else-if="query.length > 0">No results found</p>
  </div>
</template>

<script>
import { Principal } from "@dfinity/principal";
import { cosmicrafts } from 'declarations/cosmicrafts/index';
export default {
  data() {
    return {
      query: '',
      results: [],
    };
  },
  watch: {
    query(newQuery) {
      if (newQuery.length > 0) {
        this.handleInput();
      } else {
        this.results = [];
      }
    },
  },
  methods: {
   async handleInput() {
  const playerID = this.query.trim();

  try {
        const p = Principal.fromText(playerID);     
        const result = await cosmicrafts.ref_account_view(p);

        if (result[0].errorCode) {
        console.error('Error code:', result[0].errorCode);
      } else {
        this.results = [result[0]];
        console.log('Results Array:', this.results);
        console.log('Player Name:', this.results[0].playerName); // Verify playerName
      }
    } catch (error) {
        this.results = [];
        return console.log("Not valid principal");
         // Invalid Principal string
    }
},
  },
};
</script>

<style scoped>
.account-search-container {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  width: 100%;
}

.search-results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
}

.search-results li:hover {
  background-color: #f0f0f0;
}
</style>