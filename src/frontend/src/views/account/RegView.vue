<script>
import { ref, onMounted } from 'vue';
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

    if(authStore.isAuthenticated() == false) {
      console.log('User is not authenticated');
      router.push({path: '/login'});
    }

    const onAvatarSelected = (avatarId) => {
      selectedAvatarId.value = avatarId;
    };

    const registerPlayer = async () => {
      loading.value = true;
      registerResult.value = null; 
      const canister = useCanisterStore();
      const cosmicrafts = await canister.get("cosmicrafts");
      var result = false;
      var rawMessage = '';

      const avatarId = selectedAvatarId.value || 1;

      try {
        const [r, t] = await cosmicrafts.signup(
          username.value,
          avatarId, 
          referralCode.value || '' 
        );
        console.log(r,t);
        result = r;
        rawMessage = t; 
      } catch (error) {
        console.error(error);
        rawMessage = error.toString();
      }

      if (result) {       
        await authStore.userExists() ? 
        router.push('/') : 
        registerResult.value = rawMessage;
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
          {{ registerResult.value }}
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
              <input type="text" id="username" v-model="username" required placeholder="Do not use real name" />
            </div>
            <div class="form-group">
              <label for="referralCode">Referral Code:</label>
              <input type="text" id="referralCode" v-model="referralCode" placeholder="ex. WAGMI420, HODL99, etc" />
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
  background: linear-gradient(350deg, #00000043, #0000005f);
  
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
  background: #16212bb9;
  backdrop-filter: blur(4px);
  padding: 40px;
  border-radius: 12px;
  position: relative;
  border: 0.5px solid rgba(255, 255, 255, 0.151);
  box-shadow: inset 0px 4px 8px rgba(255, 255, 255, 0.08);
  height: 30%;
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
  width: 24px;
  height: 24px;
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
  background-size: 14px;
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
  background: linear-gradient(to bottom, #0390f5, #0a47d4); /* Gradient from top to bottom */
  color: white;
  border: .001rem solid rgba(255, 255, 255, 0.15); /* White stroke with 50% transparency */
  border-radius: 8px; /* Rounded corners */
  font-size: 15px;
  font-weight: 500; /* Bold font */
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

/* Avatar Image Hover Effect */
.avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-section img {
  display: block;
  transition: all 0.1s ease;
  position: relative;
  z-index: 1;
}

/* Overlay on hover */
.avatar-section::before {
  content: '';
  position: absolute;
  top: 4px;    /* Adjust these values to make the overlay smaller */
  left: -4px;
  right: -4px;
  bottom: 8px;
  transition: background 0.1s ease; /* Smooth transition effect */
  border-radius: 6px; /* Match avatar shape */
  z-index: 2; /* Ensure the overlay appears above the image */
  pointer-events: none; /* Allow clicks to pass through */
}

.avatar-section:hover::before {
  background: radial-gradient(circle, 
    rgba(0, 0, 0, 0.631) 0%,   /* Fully transparent at the center */
    rgba(0, 0, 0, 0.75) 50%,  /* Slightly dark at 50% distance from the center */
    rgba(0, 229, 255, 0.103) 90%, /* Darker at 90% from the center */
    rgba(0, 195, 255, 0.887) 100%  /* Fully transparent at the outer edge */
  );
  transition: background 0.3s ease-in-out; /* Smooth transition on hover */
}


/* Text on hover */
.avatar-section::after {
  content: 'Select Avatar';
  position: absolute;
  color: rgb(189, 189, 189);
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3; /* Text appears above the overlay */
  pointer-events: none; /* Allow clicks to pass through */
}

.avatar-section:hover::after {
  opacity: 1; /* Show text on hover */
}


</style>