import { createActor } from './actor.js';
import { callActorFunction } from './apiHandler.js';
import { parseBigIntAndPrincipalValues } from './utils.js';

require('dotenv').config();
const CANISTER_ID = process.env.COSMICRAFTS_CANISTER_ID;

const getNotifications = async (userId) => {
  const actor = await createActor(userId, CANISTER_ID);
  const notifications = await callActorFunction(actor, 'getNotifications');
  return notifications.map(notification => ({
    ...parseBigIntAndPrincipalValues(notification),
    from: convertPrincipalToString(notification.from)
  }));
};

export { getNotifications };
