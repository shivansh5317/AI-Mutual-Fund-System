import { Router } from 'express';
import * as tradingController from '../controller/trading.controller.js';
import { verifyUserAuth } from 'controller/user.controller.js';

const router: Router = Router();
router.use(verifyUserAuth)

// Market data routes (public)
router.get('/indices', tradingController.getMarketIndices);
router.get('/trending', tradingController.getTrendingStocks);
router.get('/movers', tradingController.getMarketMovers);

// User-specific trading routes
router.get('/investments', tradingController.getUserInvestments);
router.get('/positions', tradingController.getPositions);
router.get('/orders', tradingController.getOrders);
router.get('/transactions', tradingController.getTransactions);
router.get('/watchlist', tradingController.getWatchlist);
// Trading actions
router.post('/buyStock', tradingController.placeOrder);
router.post('/watchlist', tradingController.addToWatchlist);
router.delete('/watchlist/:watchlistId', tradingController.removeFromWatchlist);

export default router;