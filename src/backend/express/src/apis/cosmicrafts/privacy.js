import { createActor } from './actor.js';
import { callActorFunction } from './apiHandler.js';

require('dotenv').config();
const CANISTER_ID = process.env.COSMICRAFTS_CANISTER_ID;

const setPrivacySetting = async (userId, setting) => {
  const actor = await createActor(userId, CANISTER_ID);
  const result = await callActorFunction(actor, 'setPrivacySetting', setting);
  return result;
};

const getMyPrivacySettings = async (userId) => {
  const actor = await createActor(userId, CANISTER_ID);
  const setting = await callActorFunction(actor, 'getMyPrivacySettings');
  return setting;
};

export { setPrivacySetting, getMyPrivacySettings };
