<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AvatarSelector from '@/components/account/AvatarSelector.vue';
// Import the default avatar directly
import defaultAvatar from '@/assets/avatars/Avatar_01.jpg';

export default {
  components: {
    AvatarSelector
  },
  data() {
    return {
      username: '',
      referralCode: '',
      selectedAvatar: defaultAvatar, // Use the imported avatar image as the default
      acceptedTerms: true, // Default to checked
      showAvatarSelector: false, // Controls the avatar selector visibility
    };
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    return { router, authStore };
  },
  methods: {
    // This method is triggered when an avatar is selected
    onAvatarSelected(avatar) {
      this.selectedAvatar = avatar;
      this.showAvatarSelector = false; // Close the avatar selector after selection
    },
    // Opens the AvatarSelector component when avatar image is clicked
    openAvatarSelector() {
      this.showAvatarSelector = true; // Show the avatar selector immediately
    },
    closeAvatarSelector() {
      this.showAvatarSelector = false; // Function to close the avatar selector if needed
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
          console.log("Result: " + result + var1, + var2);

          if (result) {
            console.log("Player registered: " + result);
            this.authStore.isRegistered = true;
            this.authStore.saveStateToLocalStorage();
            this.router.push('/');
          } else {
            console.log("Player not registered");
          }

        } catch (error) {
          console.log("Error registering player:", error);
        }
      }
    }
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-panel">
      <img src="@/assets/logos/logo_full.svg" alt="Cosmicrafts" class="full-logo" />
      <form @submit.prevent="registerPlayer" class="form-grid">
        <!-- Avatar selection on the left -->
        <div class="avatar-section">
          <AvatarSelector  />
         
        </div>

        <!-- Inputs and Texts on the right -->
        <div class="right-section">
          <p class="intro-text">Let's get you started</p>
          <!-- Username input with placeholder -->
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required placeholder="Enter your username" />
          </div>
          <!-- Referral code input with placeholder -->
          <div class="form-group">
            <label for="referralCode">Referral Code:</label>
            <input type="text" id="referralCode" v-model="referralCode" placeholder="Invitation Code" />
          </div>
          <!-- Don't have a code? Get one here! -->
          <div class="referral-link">
            <p>Don't have a code? Get one <a href="https://discord.com/invite/cosmicrafts-884272584491941888" target="_blank">here!</a></p>
          </div>
        </div>
      </form>
      <!-- Terms of Service Checkbox -->
      <div class="terms-container">
        <div class="form-group terms">
          <input type="checkbox" id="terms" v-model="acceptedTerms" required />
          <label for="terms">I accept <a href="https://cosmicrafts.com/privacy-policy">Terms of Service</a> and <a href="https://cosmicrafts.com/terms-of-service">Privacy Policy</a></label>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-button">Register</button>
    </div>
    <!-- Avatar Selector Component (conditionally rendered) -->
    
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('@/assets/login/fondo.jpg'); /* Add your background image here */
  background-size: cover;
  background-position: center;
}

.register-panel {
  background: rgba(4, 15, 36, 0.9); /* Add some transparency for the background */
  padding: 40px;
  border-radius: 10px;
  position: relative;
  z-index: 1;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 0.2);
  max-width: 600px;
  width: 100%;
}

.register-panel::after {
  content: '';
  background: url('@/assets/logos/logo.svg') no-repeat center center;
  background-size: 70%;
  opacity: 0.025;
  position: absolute;
  top: 0; /* Align to the top */
  left: 0; /* Align to the left */
  width: 100%;
  height: 100%;
  z-index: -1; /* Ensure it’s behind the content */
}

/* Full Logo Styling */
.full-logo {
  display: block;
  margin: 0 auto 30px auto;
  width: 200px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

/* Grid Layout for Avatar and Right Section */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected-avatar {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #00FFFF;
  cursor: pointer;
}

/* Right Section for Inputs */
.right-section {
  display: flex;
  flex-direction: column;
}

.intro-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #ffffff;
}

label {
  display: block;
  margin-bottom: 4px;
  color: #89B4C7;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  background: linear-gradient(to bottom, #303030, #202020);
  border: 1px solid #00FFFF;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #b7b7b7;
}

input::placeholder {
  color: #616161; /* Set default color */
}
.referral-link {
  margin-top: -11px;
  font-size: 11px;
}

.referral-link p {
  color: #89B4C7;
  font-weight: normal;
}

.referral-link a {
  color: #21B6F6;
  text-decoration: underline;
}

.terms {
  display: flex;
  align-items: center;
  margin-top: 8px;
  height: 100%;
}

.terms input[type="checkbox"] {
  appearance: none;
  width: 31px;
  height: 31px;
  border: 1px solid #00FFFF;
  border-radius: 4px;
  background-color: #202020;
  position: relative;
  margin-right: 8px;
  cursor: pointer;
}

.terms input[type="checkbox"]:checked {
  background-image: url('@/assets/icons/checkmark_icon.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 18px;
  
}

.terms label {
  color: #89B4C7;
}

.terms a {
  color: #21B6F6;
  text-decoration: underline;
}

button.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

button.submit-button:hover {
  background-color: #0056b3;
}

/* Responsive layout for small screens */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .avatar-section {
    justify-content: flex-start;
    margin-bottom: 20px;
  }
}
</style>