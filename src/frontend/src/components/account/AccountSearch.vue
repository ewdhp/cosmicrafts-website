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
    <div class="search-input">
      <input v-model="query" @input="handleInput" placeholder="Search..." />
      <img src="@/assets/icons/search_icon.svg" class="search-icon" />
    </div>
    <transition name="slide-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-if="isMenuVisible" class="search-results">
        <ul v-if="results.length > 0" :key="results.length">
          <li v-for="(result, index) in results" :key="index">
            <FriendQuery :avatarUrl="result.avatarUrl" :name="result.playerName" />
          </li>
        </ul>
        <p v-else-if="query.length > 0" class="no-results">No results found</p>
      </div>
    </transition>
  </div>  
</template>

<style scoped>
.search {
  position: relative;
  display: flex;
  background: linear-gradient(to bottom, #282828, #252525);
  border-radius: 18px;
  border-color: #6A6A6A;
  box-shadow: 0 2px 4px rgb(0, 0, 0);
  box-shadow: inset 1px 1px 2px 2px rgba(255, 255, 255, 0.025);
}

.search-input {
  position: relative; /* Add relative positioning to control the icon */
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.search-input input {
  padding: 8px 42px 8px 16px;
  background: none;
  border: none;
  color: #b4b4b4;
}

.search-input input::placeholder {
  color: #747474;
}

.search-input input:focus {
  background: linear-gradient(to top, #2d2d2d, rgb(43, 43, 43));
  padding: 8px 42px 8px 16px;
  border-radius: 25px;
  outline: none;
  box-shadow: none;
}

.search-input .search-icon {
  position: absolute;
  right: 15px;
  width: 20px;
  height: 20px;
  pointer-events: none; /* Ensure the icon doesn't interfere with input */
  transition: opacity 0.2s ease;
}

.search-results {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.search-results ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-results ul li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.search-results ul li:last-child {
  border-bottom: none;
}

.search-results ul li a {
  text-decoration: none;
  color: #333;
  display: block;
  width: 100%;
  padding: 10px;
}

.search-results ul li a:hover {
  background-color: #f0f0f0;
}

.no-results {
  padding: 10px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
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