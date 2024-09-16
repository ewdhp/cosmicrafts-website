<template>
  <div>
    <!-- Loading Spinner with Blurred Background -->
    <div class="top" v-if="loading">
      <LoadingSpinner :isLoading="loading" />
    </div>

    <div class="register-container">
      <div class="register-panel">
        <img src="@/assets/logos/logo_full.svg" alt="Cosmicrafts" class="full-logo" />

        <!-- Registration Result -->
        <div v-if="registerResult" class="register-result">
          {{ registerResult }}
        </div>

        <form @submit.prevent="registerPlayer" class="form-grid">
          <!-- Avatar Selector Component on the left -->
          <div class="avatar-section">
            <AvatarSelector @avatar-selected="onAvatarSelected" />
          </div>

          <!-- Inputs and Texts on the right -->
          <div class="right-section">
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" v-model="username" required placeholder="Enter your username" />
            </div>
            <div class="form-group">
              <label for="referralCode">Referral Code:</label>
              <input type="text" id="referralCode" v-model="referralCode" placeholder="Invitation Code" />
            </div>
            <div class="referral-link">
              <p>Don't have a code? Get one <a href="https://discord.com/invite/cosmicrafts-884272584491941888" target="_blank">here!</a></p>
            </div>
          </div>

          <!-- Terms of Service Checkbox (new grid row) -->
          <div class="terms-column">
            <div class="form-group terms">
              <input type="checkbox" id="terms" v-model="acceptedTerms" required />
              <label for="terms">
                I accept <a href="https://cosmicrafts.com/privacy-policy">Terms of Service</a> and <a href="https://cosmicrafts.com/terms-of-service">Privacy Policy</a>
              </label>
            </div>
          </div>

          <!-- Submit Button (new grid row) -->
          <div class="submit-column">
            <button type="submit" class="submit-button">Register</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCanisterStore } from '@/stores/canister';
import AvatarSelector from '@/components/account/AvatarSelector.vue';
import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';

export default {
  components: {
    AvatarSelector,
    LoadingSpinner
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const loading = ref(false);
    const username = ref('');
    const referralCode = ref('');
    const selectedAvatarId = ref(null);
    const acceptedTerms = ref(true);
    const registerResult = ref(null);

    if(authStore.isAuthenticated == false) {
      console.log('User is not authenticated');
      router.push({path: '/login'});
    }

    const onAvatarSelected = (avatarId) => {
      selectedAvatarId.value = avatarId;
    };

    const registerPlayer = async () => {
      loading.value = true;
      registerResult.value = null; // Clear previous result
      const canister = useCanisterStore();
      const cosmicrafts = await canister.get("cosmicrafts");
      var result = false;
      var rawMessage = '';

      // Set default avatar ID to 1 if none is selected
      const avatarId = selectedAvatarId.value || 1;

      try {
        const [r, a, c] = await cosmicrafts.registerPlayer(
          username.value,
          avatarId,  // Use default avatar ID if none is selected
          referralCode.value || ''  // Provide an empty string if no referral code is given
        );
        result = r;
        rawMessage = a;  // Capture the raw message (assuming 'a' holds the message)
      } catch (error) {
        console.error(error);
        rawMessage = error.toString();  // Capture the error message from blockchain if there's a failure
      }

      if (result) {
        await authStore.isPlayerRegistered() ? router.push('/') : registerResult.value = rawMessage;
      } else {
        registerResult.value = rawMessage;
      }
      
      loading.value = false;
    };

    return {
      loading,
      username,
      referralCode,
      selectedAvatarId,
      acceptedTerms,
      onAvatarSelected,
      registerPlayer,
      registerResult
    };
  }
};
</script>

<style scoped>
.top {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 9999;
  background: rgba(34, 47, 90, 0.95);
}

.register-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(350deg, #161a2070, #1f242c4c);
  overflow: hidden;
}

.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/login/fondo.jpg');
  background-size: cover;
  background-position: center;
  opacity: 1; /* Adjust this value for the desired transparency */
  z-index: -1;
}


.register-panel {
  background: #1f303e5f;
  backdrop-filter: blur(4px);
  padding: 36px;
  border-radius: 12px;
  position: relative;
  border: 0.5px solid rgba(0, 0, 0, 0.114);
  box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 0.149);
  max-width: 360px;
  width: 100%;
}

/* Full Logo Styling */
.full-logo {
  display: block;
  margin: 0 auto 32px auto;
  width: 196px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.25));
}

/* Grid Layout for Avatar and Right Section */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
}

.terms-column, .submit-column {
  grid-column: 1 / span 2; /* Span across both columns */
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
  font-size: 14px;
  display: block;
  margin-bottom: 2px;
  margin-top: 4px;
  color: #ffffff;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  background: linear-gradient(to bottom, #303030, #202020);
  border: .25px solid #00FFFF;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #ffffff;
}

input::placeholder {
  color: #7b7b7b; /* Set default color */
}

.referral-link {
  margin-top: -12px;
  font-size: 11px;
}

.referral-link p {
  color: #d8e7ee;
  font-weight: normal;
}

.referral-link a {
  font-weight: bold;
  color: #21B6F6;
  text-decoration: underline;
}

input::placeholder {
  color: #7b7b7b;
}

.referral-link p {
  color: #b0bec5;
}

.terms {
  display: flex;
  align-items: center;
}

.terms input[type="checkbox"] {
  appearance: none;
  width: 32px;
  height: 32px;
  border: 1px solid #00FFFF;
  border-radius: 4px;
  background-color: #202020;
  margin-right: 8px;
  cursor: pointer;
}

.terms input[type="checkbox"]:checked {
  background-image: url('@/assets/icons/checkmark_icon.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 22px;
}

.terms label {
  color: #bfddea;
  font-size: 13px;
}

.terms a {
  color: #21B6F6;
  font-weight: bold;
  text-decoration: underline;
}

button.submit-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to bottom, #00C0FC, #0039BA); /* Gradient from top to bottom */
  color: white;
  border: .001rem solid rgba(255, 255, 255, 0.15); /* White stroke with 50% transparency */
  border-radius: 8px; /* Rounded corners */
  font-size: 16px;
  font-weight: bold; /* Bold font */
  cursor: pointer;
  transition: background-color 0.1s, box-shadow 0.2s; /* Smooth transition for hover effects */
  margin-top: 8px;

}

/* Hover effect */
button.submit-button:hover {
  background: linear-gradient(to bottom, #1dcaff, #0e40b5); /* Gradient from top to bottom */
}

/* Active effect (when clicked) */
button.submit-button:active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), /* Adjust drop shadow when active */
              inset 0 1px 3px rgba(255, 255, 255, 0.3); /* Adjust inner shadow when active */
}

</style>