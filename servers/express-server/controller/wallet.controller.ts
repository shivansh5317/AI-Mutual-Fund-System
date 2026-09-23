import { Request, Response, NextFunction } from 'express';
import { prisma } from '@repo/prisma/db';
import { catchAsync } from 'utils/catchAsyncFunc.js';
import { OkResponseStrategy } from 'controller/response/response.ok.controller.js';
import { ModifiedRequest } from 'helper/iHelper.js';

export const getWalletBalance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;

    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      // Create wallet if doesn't exist
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          lockedAmount: 0,
        },
      });
    }

    const walletData = {
      balance: wallet.balance,
      lockedAmount: wallet.lockedAmount,
      availableBalance: wallet.balance - wallet.lockedAmount,
    };

    new OkResponseStrategy().handleResponse(res, walletData);
  }
);

export const addFunds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid amount' });
      return;
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount: parseFloat(amount.toString()),
        status: 'COMPLETED', // In real app, this would be PENDING until payment confirmation
        description: `Funds added via ${paymentMethod || 'Unknown'}`,
        reference: `TXN_${Date.now()}`,
      },
    });

    // Update wallet balance
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      update: {
        balance: {
          increment: parseFloat(amount.toString()),
        },
      },
      create: {
        userId,
        balance: parseFloat(amount.toString()),
        lockedAmount: 0,
      },
    });

    const responseData = {
      transaction,
      newBalance: wallet.balance,
      message: `₹${amount} added successfully`,
    };

    new OkResponseStrategy().handleResponse(res, responseData);
  }
);

export const getTransactionHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    new OkResponseStrategy().handleResponse(res, transactions);
  }
);

export const withdrawFunds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;
    const { amount, bankAccount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid amount' });
      return;
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance - wallet.lockedAmount < amount) {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    // Create withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        amount: parseFloat(amount.toString()),
        status: 'PENDING',
        description: `Withdrawal to ${bankAccount || 'Bank Account'}`,
        reference: `WTH_${Date.now()}`,
      },
    });

    // Update wallet balance
    await prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: parseFloat(amount.toString()),
        },
      },
    });

    const responseData = {
      transaction,
      message: `Withdrawal of ₹${amount} initiated`,
    };

    new OkResponseStrategy().handleResponse(res, responseData);
  }
);