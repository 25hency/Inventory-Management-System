import express from 'express';
import { getInventoryAnalytics } from '../controllers/analyticsController.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/inventory-analytics', getInventoryAnalytics);

export default analyticsRouter;