import express from 'express';
import CController from '../controllers/cosmicrafts.js';

const cRouter = express.Router();

cRouter.post('/registerPlayer',CController.registerPlayer);

export default cRouter;