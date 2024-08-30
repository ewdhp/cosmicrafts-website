<template>
  <div class="login-view">
    <h1>Register</h1>
    <AvatarSelector @avatar-selected="onAvatarSelected" />
    <form @submit.prevent="registerPlayer">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="referralCode">Referral Code:</label>
        <input type="text" id="referralCode" v-model="referralCode" />
      </div>
      <div>
        <label for="selectedAvatar">Selected Avatar:</label>
        <input type="text" id="selectedAvatar" v-model="selectedAvatar" readonly />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import AvatarSelector from './AvatarSelector.vue';
import { getCanister } from '../../services/CanisterFactoryService.js';

export default {
  components: {
    AvatarSelector
  },
  data() {
    return {
      username: '',
      referralCode: '',
      selectedAvatar: ''
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    onAvatarSelected(avatar) {
      this.selectedAvatar = avatar;
    },
    async registerPlayer() {
      try {
        const canister = await getCanister("cosmicrafts");
        if (canister) {
          const result = await canister.registerPlayer(this.username, this.referralCode, this.selectedAvatar);
          console.log("Player registered:", result);
          if (result === true) {
            this.router.push('/dashboard');
          } else {
            console.error("Registration failed.");
          }
        } else {
          console.error("Failed to initialize canister.");
        }
      } catch (error) {
        console.error("Error registering player:", error);
      }
    }
  }
};
</script>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: darkblue;
}
</style>