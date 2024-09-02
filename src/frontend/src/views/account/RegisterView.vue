<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AvatarSelector from '@/components/account/AvatarSelector.vue';

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
    const authStore = useAuthStore();
    return { router, authStore };
  },
  methods: {
    onAvatarSelected(avatar) {
      this.selectedAvatar = avatar;
    },
    async registerPlayer() {
      const cosmicrafts = this.authStore.cosmicraftsCanister;
      if (cosmicrafts) {
        console.log("Registering player...");
        try {
          const [result, var1, var2] = await cosmicrafts.registerPlayer(
            this.username,
            this.selectedAvatar,
            this.referralCode
          );

          if (result) {
            console.log("Player registered: " + result);
            this.authStore.isRegistered = true;
            this.router.push('/home');
          }
          console.log("Player not registered");

        } catch (error) {
          console.log("Error registering player:", error);
        }
      }
    }
  }
};
</script>

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