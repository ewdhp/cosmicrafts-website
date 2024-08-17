import express from 'express';
import cosmicraftsController from '../../controllers/cosmicrafts/CosmicraftsController.js';

const cosmicraftsRouter = express.Router();

// Define routes and use controller methods
cosmicraftsRouter.post('/registerPlayer', cosmicraftsController.registerPlayer);

// Define other routes similarly
// cosmicraftsRouter.get('/someOtherRoute', cosmicraftsController.someOtherMethod);

export default cosmicraftsRouter;
