import { Router } from 'express';
import * as walletController from '../controller/wallet.controller.js';
import { verifyUserAuth } from 'controller/user.controller.js';

const router: Router = Router();
router.use(verifyUserAuth);
// Wallet routes
router.get('/balance', walletController.getWalletBalance);
router.post('/add-funds', walletController.addFunds);
router.post('/withdraw', walletController.withdrawFunds);
router.get('/transactions', walletController.getTransactionHistory);

export default router;