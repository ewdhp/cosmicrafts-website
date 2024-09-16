<template>
  <div class="login-container">
    <div class="login-panel">
      <!-- Logo at the top -->
      <img src="@/assets/login/Cosmicrafts_Logo.svg" class="full-logo" alt="Cosmicrafts Logo" />

      <!-- "Connect with" Text -->
      <label class="cosmic-label-connect">Connect with:</label>

      <!-- Custom Google Button -->
      <div class="inner-grid">
        <div class="btn-div" @click="loginWithGoogle">
          <label class="btn-label">
            <img src="@/assets/login/google_logo.svg" class="button-account-icon" alt="Google" />
            <span class="btn-text">Login with Google</span>
          </label>
        </div>

        <!-- Other Auth Methods -->
        <div class="btn-div" v-for="method in authMethods" :key="method.text" @click="method.onClick">
          <label class="btn-label">
            <img :src="method.logo" class="button-account-icon" :alt="method.text" />
            <span class="btn-text">Login with {{ method.text }}</span>
          </label>
        </div>
      </div>

      <!-- Clarification Message -->
      <div class="clarification-message">
        <p>Create a new account by connecting.</p>
      </div>
    </div>

    <!-- WOU Info detached from the panel, at the bottom -->
    <div class="bottom-div">
      <img src="@/assets/login/wou_logo.svg" alt="wou-icon" class="bottom-wou-icon" />
      <label class="bottom-label">
        &copy;&nbsp;2023 World of Unreal<br />
        All trademarks referenced herein are the properties of their respective owners.
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import icpLogo from '@/assets/login/icp_logo.svg';
import metaMaskLogo from '@/assets/login/metaMask_icon.svg';
import phantomLogo from '@/assets/login/Phantom_icon.svg';

const authStore = useAuthStore();
const router = useRouter();

const handleAfterLogin = async () => {
  router.push({ path: '/' });
};

// Custom Google login handler
const loginWithGoogle = () => {
  window.google.accounts.id.prompt();
};

const loginIC = async () => {
  await authStore.loginWithInternetIdentity();
  router.push({ path: '/' });
};

const loadGoogleIdentityServices = () => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.onload = initializeGoogleSignIn;
  script.onerror = () => {
    setTimeout(loadGoogleIdentityServices, 10000);
  };
  document.body.appendChild(script);
};

const initializeGoogleSignIn = () => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  });
};

const handleCredentialResponse = (response) => {
  authStore.loginWithGoogle(response, router).then(handleAfterLogin);
};

onMounted(() => {
  loadGoogleIdentityServices();
});

const authMethods = [
  {
    logo: icpLogo,
    text: 'Internet Identity',
    onClick: () => loginIC(),
  },
  {
    logo: metaMaskLogo,
    text: 'MetaMask',
    onClick: () => authStore.loginWithMetaMask().then(handleAfterLogin),
  },
  {
    logo: phantomLogo,
    text: 'Phantom',
    onClick: () => authStore.loginWithPhantom().then(handleAfterLogin),
  },
];
</script>

<style scoped>
/* Container for the login screen */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(350deg, #161a2070, #1f242c4c);
  overflow: hidden;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/login/fondo.jpg');
  background-size: cover;
  background-position: center;
  opacity: 1;
  z-index: -1;
}

/* Login panel styling */
.login-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(31, 48, 62, 0.37);
  backdrop-filter: blur(4px);
  padding: 40px;
  border-radius: 12px;
  border: 0.5px solid rgba(0, 0, 0, 0.114);
  box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 0.149);
  max-width: 360px;
  width: 100%;
}

/* Full logo styling */
.full-logo {
  display: block;
  width: 196px;
  margin-bottom: 32px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.25));
}

/* Connect with text */
.cosmic-label-connect {
  color: #FFFFFF;
  font-weight: 600;
  margin-bottom: 24px;
  font-size: 1.5rem;
}

/* Custom Google Button & Auth Methods Grid */
.inner-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 24px;
}

/* Button for Auth Methods and Custom Google Button */
.btn-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  background: linear-gradient(135deg, rgba(28, 30, 33, 0.625), rgba(31, 36, 44, 0.765));
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 20px;
  transition: background 0.1s ease;
}

.btn-div:hover {
  background: linear-gradient(135deg, rgba(40, 45, 55, 0.635), rgba(50, 60, 70, 0.612));
}

/* Icon inside the button */
.button-account-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

/* Label and Text inside the button */
.btn-label {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start; /* Align text and icon on the left */
  color: #FFFFFF;
  font-size: 1rem;
}

/* Text inside the button */
.btn-text {
  margin-left: 8px;
}

/* Clarification message */
.clarification-message {
  text-align: center;
  font-size: 14px;
  color: #a4a4a4;
}

/* WOU info, detached from panel and placed at the bottom */
.bottom-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
}

.bottom-wou-icon {
  width: 48px;
}

.bottom-label {
  color: #aaaaaa;
  display: block;
  font-size: 0.775rem;
  text-align: center;
  margin-top: 8px;
}
</style>
