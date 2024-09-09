import 'dotenv/config'; // Use ES module syntax to load environment variables
import { Principal } from '@dfinity/principal';
import { createActor, createPublicActor, callActorFunction } from './actor.js';
import { parseBigIntAndPrincipalValues, convertPrincipalToString } from './utils.js';

const CANISTER_ID = process.env.COSMICRAFTS_CANISTER_ID;

const CCanister = {

  registerPlayer: async (userId, username, avatarId) => {
    const actor = await createActor(userId, CANISTER_ID);
    const result = await callActorFunction(actor, 'registerPlayer', username, avatarId);
    return parseBigIntAndPrincipalValues(result);
  },

  getNotifications: async (userId) => {
    const actor = await createActor(userId, CANISTER_ID);
    const notifications = await callActorFunction(actor, 'getNotifications');
    return notifications.map(notification => ({
      ...parseBigIntAndPrincipalValues(notification),
      from: convertPrincipalToString(notification.from)
    }));
  },

  sendFriendRequest: async (userId, friendId) => {
    try {
      const actor = await createActor(userId, CANISTER_ID);
      const principal = Principal.fromText(String(friendId));
      const result = await callActorFunction(actor, 'sendFriendRequest', principal);
      return parseBigIntAndPrincipalValues(result);
    } catch (error) {
      console.error(`Error in sendFriendRequest: Invalid friendId ${friendId}`, error);
      throw error;
    }
  },

  acceptFriendRequest: async (userId, friendId) => {
    try {
      const actor = await createActor(userId, CANISTER_ID);
      const principal = Principal.fromText(String(friendId));
      const result = await callActorFunction(actor, 'acceptFriendRequest', principal);
      return parseBigIntAndPrincipalValues(result);
    } catch (error) {
      console.error(`Error in acceptFriendRequest: Invalid friendId ${friendId}`, error);
      throw error;
    }
  },

  getFriendsList: async (userId) => {
    const actor = await createActor(userId, CANISTER_ID);
    const friends = await callActorFunction(actor, 'getFriendsList');
    return friends.map(friend => convertPrincipalToString(friend));
  },

  getFriendRequests: async (userId) => {
    const actor = await createActor(userId, CANISTER_ID);
    const requests = await callActorFunction(actor, 'getFriendRequests');
    return requests.map(request => ({
      ...parseBigIntAndPrincipalValues(request),
      from: convertPrincipalToString(request.from),
      to: convertPrincipalToString(request.to)
    }))
  },

  setPrivacySetting: async (userId, setting) => {
    const actor = await createActor(userId, CANISTER_ID);
    const result = await callActorFunction(actor, 'setPrivacySetting', setting);
    return result;
  },

  getMyPrivacySettings: async (userId) => {
    const actor = await createActor(userId, CANISTER_ID);
    const setting = await callActorFunction(actor, 'getMyPrivacySettings');
    return setting;
  },

  ref_account: async (userId) => {
    const actor = await createActor(userId, CANISTER_ID);
    const setting = await callActorFunction(actor, 'ref_account');
    return setting;
  },
  ref_id_gen: async (userId) => {
    const actor = await createActor(userId, CANISTER_ID);
    const setting = await callActorFunction(actor, 'ref_id_gen');
    return setting;
  },
};

export default CCanister;