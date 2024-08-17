import { Principal } from '@dfinity/principal';
import { createActor } from './actor1.js';
import { callActorFunction } from './apiHandler.js';
import { parseBigIntAndPrincipalValues, convertPrincipalToString } from './utils.js';


require('dotenv').config();
const CANISTER_ID = process.env.COSMICRAFTS_CANISTER_ID;


const sendFriendRequest = async (userId, friendId) => {
  try {
    const actor = await createActor(userId, CANISTER_ID);
    const principal = Principal.fromText(String(friendId));
    const result = await callActorFunction(actor, 'sendFriendRequest', principal);
    return parseBigIntAndPrincipalValues(result);
  } catch (error) {
    console.error(`Error in sendFriendRequest: Invalid friendId ${friendId}`, error);
    throw error;
  }
};

const acceptFriendRequest = async (userId, friendId) => {
  try {
    const actor = await createActor(userId, CANISTER_ID);
    const principal = Principal.fromText(String(friendId));
    const result = await callActorFunction(actor, 'acceptFriendRequest', principal);
    return parseBigIntAndPrincipalValues(result);
  } catch (error) {
    console.error(`Error in acceptFriendRequest: Invalid friendId ${friendId}`, error);
    throw error;
  }
};

const getFriendsList = async (userId) => {
  const actor = await createActor(userId, CANISTER_ID);
  const friends = await callActorFunction(actor, 'getFriendsList');
  return friends.map(friend => convertPrincipalToString(friend));
};

const getFriendRequests = async (userId) => {
  const actor = await createActor(userId, CANISTER_ID);
  const requests = await callActorFunction(actor, 'getFriendRequests');
  return requests.map(request => ({
    ...parseBigIntAndPrincipalValues(request),
    from: convertPrincipalToString(request.from),
    to: convertPrincipalToString(request.to)
  }));
};

export { sendFriendRequest, acceptFriendRequest, getFriendsList, getFriendRequests };
