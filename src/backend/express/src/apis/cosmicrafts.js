import express from 'express';
import cosmicraftsController from '../../controllers/cosmicrafts/CosmicraftsController.js';

const cosmicraftsRouter = express.Router();
cosmicraftsRouter.post('/registerPlayer', cosmicraftsController.registerPlayer);
export default cosmicraftsRouter;
