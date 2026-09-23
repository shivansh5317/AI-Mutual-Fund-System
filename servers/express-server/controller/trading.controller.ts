import { prisma } from "@repo/prisma/db";
import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "utils/catchAsyncFunc.js";
import { OkResponseStrategy } from "./response/response.ok.controller.js";
import { ModifiedRequest } from "helper/iHelper.js";

export const getMarketIndices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const indices = [
      { name: "NIFTY", value: 25889.25, change: 70.7, changePercent: 0.27 },
      { name: "SENSEX", value: 84737.36, change: 177.71, changePercent: 0.21 },
      {
        name: "BANKNIFTY",
        value: 53175.45,
        change: 248.7,
        changePercent: 0.42,
      },
      {
        name: "MIDCAPNIFTY",
        value: 13753.75,
        change: 101.45,
        changePercent: 0.74,
      },
      { name: "FINNIFTY", value: 27854.9, change: 89.3, changePercent: 0.32 },
    ];

    new OkResponseStrategy().handleResponse(res, indices);
  }
);

export const getTrendingStocks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stocks = [
      {
        id: "1",
        symbol: "MEESHO",
        name: "Meesho",
        price: 214.62,
        change: -1.72,
        changePercent: -0.8,
        logo: "🛍️",
      },
      {
        id: "2",
        symbol: "RELPOWER",
        name: "Reliance Power",
        price: 38.2,
        change: 2.51,
        changePercent: 7.03,
        logo: "⚡",
      },
      {
        id: "3",
        symbol: "SHAKTIPUMP",
        name: "Shakti Pumps",
        price: 725.05,
        change: 17.65,
        changePercent: 2.5,
        logo: "💧",
      },
      {
        id: "4",
        symbol: "RICOAUTO",
        name: "Rico Auto Inds",
        price: 126.47,
        change: 9.09,
        changePercent: 7.74,
        logo: "🚗",
      },
    ];

    new OkResponseStrategy().handleResponse(res, stocks);
  }
);

export const getMarketMovers = catchAsync(
  async (req: Request, res: Response) => {
    const { type = "gainers" } = req.query;

    // Get mutual funds data to calculate market movers
    const funds = await prisma.mutualFund.findMany({
      take: 100,
      orderBy: { updatedAt: "desc" },
    });

    const stockData = funds.map((fund, index) => {
      const basePrice = 100;
      const returns1yr = fund.returns1yr || 0;
      const currentPrice = basePrice * (1 + returns1yr / 100);

      const randomChange = (Math.random() - 0.5) * 8; // -4% to +4%
      const previousPrice = basePrice * (1 + (returns1yr - randomChange) / 100);

      const change = currentPrice - previousPrice;
      const changePercent = (change / previousPrice) * 100;
      const volume = Math.floor(Math.random() * 10000000) + 1000000; // Random volume

      return {
        symbol:
          fund.schemeName.split(" ")[0] || fund.schemeName.substring(0, 10),
        name: fund.schemeName,
        price: currentPrice,
        change,
        changePercent,
        volume,
      };
    });

    let data: Array<unknown> = [];
    if (type === "gainers") {
      data = stockData
        .filter((stock) => stock.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 5);
    } else if (type === "losers") {
      data = stockData
        .filter((stock) => stock.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 5);
    } else {
      // Volume shockers - highest volume
      data = stockData.sort((a, b) => b.volume - a.volume).slice(0, 5);
    }
    new OkResponseStrategy().handleResponse(res, data);
  }
);

export const getUserInvestments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;

    const orders = await prisma.order.findMany({
      where: {
        userId,
        status: "EXECUTED",
      },
    });

    let totalInvested = 0;
    let currentValue = 0;

    orders.forEach((order) => {
      const orderValue = order.quantity * order.price;
      if (order.side === "BUY") {
        totalInvested += orderValue;
        currentValue += orderValue * 1.05;
      } else {
        totalInvested -= orderValue;
        currentValue -= orderValue;
      }
    });

    const totalReturn = currentValue - totalInvested;
    const totalReturnPercent =
      totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    const investments = {
      current: currentValue,
      oneDayReturn: currentValue * 0.01,
      oneDayReturnPercent: 1.0,
      totalReturn,
      totalReturnPercent,
      invested: totalInvested,
    };

    new OkResponseStrategy().handleResponse(res, investments);
  }
);

export const getPositions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;

    const positions = await prisma.position.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const positionsWithPnL = positions.map((position) => {
      const pnl =
        (position.currentPrice - position.entryPrice) * position.quantity;
      const pnlPercent =
        ((position.currentPrice - position.entryPrice) / position.entryPrice) *
        100;
      return { ...position, pnl, pnlPercent };
    });

    new OkResponseStrategy().handleResponse(res, positionsWithPnL);
  }
);

export const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    new OkResponseStrategy().handleResponse(res, orders);
  }
);

export const getWatchlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;

    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    new OkResponseStrategy().handleResponse(res, watchlist);
  }
);

export const placeOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;
    const { symbol, side, quantity, price, type } = req.body;

    const order = await prisma.order.create({
      data: {
        userId,
        symbol,
        side,
        quantity,
        price,
        type,
        status: "PENDING",
      },
    });

    if (type === "MARKET") {
      await executeOrder(order.id, userId);
    }

    new OkResponseStrategy().handleResponse(res, order);
  }
);

export const addToWatchlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;
    const { symbol, name, price, change, changePercent } = req.body;

    const watchlistItem = await prisma.watchlist.upsert({
      where: {
        userId_symbol: { userId, symbol },
      },
      update: {
        name,
        price,
        change,
        changePercent,
      },
      create: {
        userId,
        symbol,
        name,
        price,
        change,
        changePercent,
      },
    });

    new OkResponseStrategy().handleResponse(res, watchlistItem);
  }
);

export const removeFromWatchlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;
    const { watchlistId } = req.params;

    await prisma.watchlist.delete({
      where: { id: watchlistId, userId },
    });

    new OkResponseStrategy().handleResponse(res, { message: "Removed from watchlist" });
  }
);

export const getTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as ModifiedRequest).user.id;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    new OkResponseStrategy().handleResponse(res, transactions);
  }
);

// Helper function to execute orders
async function executeOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const totalAmount = order.quantity * order.price;

  if (order.side === "BUY") {
    // Deduct from wallet
    await prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: totalAmount } },
    });

    // Holdings removed - managed through investments model

    // Create transaction
    await prisma.transaction.create({
      data: {
        userId,
        type: "BUY",
        amount: totalAmount,
        description: `Bought ${order.quantity} ${order.symbol} @ ${order.price}`,
        status: "COMPLETED",
      },
    });
  } else if (order.side === "SELL") {
    // Add to wallet
    await prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: totalAmount } },
    });

    // Holdings removed - managed through investments model

    // Create transaction
    await prisma.transaction.create({
      data: {
        userId,
        type: "SELL",
        amount: totalAmount,
        description: `Sold ${order.quantity} ${order.symbol} @ ${order.price}`,
        status: "COMPLETED",
      },
    });
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "EXECUTED" },
  });
}
