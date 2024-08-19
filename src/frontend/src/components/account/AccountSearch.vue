<script>
import { Principal } from "@dfinity/principal";
import { cosmicrafts } from 'declarations/cosmicrafts/index';
export default {
  data() {
    return {
      isMenuVisible: false,
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
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    beforeEnter(el) {
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = 0;
    },
    enter(el, done) {
      el.offsetHeight; // trigger reflow
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      el.style.transform = 'translateY(0)';
      el.style.opacity = 1;
      done();
    },
    leave(el, done) {
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = 0;
      done();
    },
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

<template>

   <div class="search">
    <div class="search-input" @click="toggleMenu">
       <input v-model="query" @input="handleInput" />
    </div>
    <transition name="slide-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-if="isMenuVisible" class="search-results">
        <ul v-if="results.length > 0" :key="results.length">
          <li v-for="(result, index) in results" :key="index">   
          <FriendQuery :avatarUrl="result.avatarUrl" :name="result.playerName" />
          </li>
        </ul>
        <p v-else-if="query.length > 0">No results found</p>      
      </div>
    </transition>
  </div>


</template>

<style scoped>

.search {
  position: relative;
  display: flex;
  border: 1px solid;


}
.search-input {
  display: flex;
  padding: 10px;
}

.search-results {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu ul li {
  border-bottom: 1px solid #ddd;
}

.menu ul li:last-child {
  border-bottom: none;
}

.menu ul li a {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
}

.menu ul li a:hover {
  background-color: #f0f0f0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>