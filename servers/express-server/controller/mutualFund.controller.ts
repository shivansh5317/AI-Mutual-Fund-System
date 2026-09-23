import { Request, Response } from 'express';
import * as service from '@repo/ai-pinecone/service.js';
import type { RecommendationInput } from '@repo/zod-schemas/types/mutualFund.types';

export async function getRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { amcName, category, amountInvested, tenure }: RecommendationInput = req.body;

    if (!amountInvested || !tenure) {
      res.status(400).json({ error: 'amountInvested and tenure are required' });
      return;
    }

    const recommendations = await service.getRecommendations({
      amcName,
      category,
      amountInvested: parseFloat(amountInvested.toString()),
      tenure: parseFloat(tenure.toString()),
    });

    res.json({ success: true, data: recommendations });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const analytics = await service.getAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

export async function getFundDetails(req: Request, res: Response): Promise<void> {
  try {
    const fund = await service.getFundDetails(req.params.id!);
    if (!fund) {
      res.status(404).json({ error: 'Fund not found' });
      return;
    }
    res.json({ success: true, data: fund });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

export async function getAllFunds(req: Request, res: Response): Promise<void> {
  try {
    const { category, amcName, search, limit, offset } = req.query;
    
    const result = await service.getAllFunds({
      category: category as string,
      amcName: amcName as string,
      search: search as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    
    res.json({ success: true, data: result.funds, totalCount: result.totalCount });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

export async function getFilters(req: Request, res: Response): Promise<void> {
  try {
    const filters = await service.getFilters();
    res.json({ success: true, data: filters });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}