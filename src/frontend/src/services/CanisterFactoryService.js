import { cosmicrafts } from '../../../declarations/cosmicrafts/index.js';
import { frontend } from '../../../declarations/frontend/index.js'; // Adjust the path as necessary

const canisters = {
  cosmicrafts: null,
  frontend: null,
};

const canisterImports = {
  cosmicrafts,
  frontend,
};

const initializeCanister = async (name) => {
  try {
    if (canisterImports[name]) {
      canisters[name] = canisterImports[name];
    } else {
      throw new Error(`Unknown canister name: ${name}`);
    }
  } catch (error) {
    console.error(`Failed to initialize ${name} canister:`, error);
  }
};

export const getCanister = async (name) => {
  if (!canisters[name]) {
    await initializeCanister(name);
  }
  return canisters[name];
};