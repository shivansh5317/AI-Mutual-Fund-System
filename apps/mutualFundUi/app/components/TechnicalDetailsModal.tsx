import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface TechnicalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundName: string;
  technicalData: {
    alpha: number;
    beta: number;
    sharpeRatio: number;
    sortinoRatio: number;
    expenseRatio: number;
    standardDeviation: number;
    treynorRatio: number;
  };
}

export function TechnicalDetailsModal({ 
  isOpen, 
  onClose, 
  fundName, 
  technicalData 
}: TechnicalDetailsModalProps) {
  const metrics = [
    { 
      name: 'Alpha', 
      value: technicalData.alpha.toFixed(2), 
      description: 'Excess return relative to benchmark'
    },
    { 
      name: 'Beta', 
      value: technicalData.beta.toFixed(2), 
      description: 'Volatility relative to market'
    },
    { 
      name: 'Sharpe Ratio', 
      value: technicalData.sharpeRatio.toFixed(2), 
      description: 'Risk-adjusted return measure'
    },
    { 
      name: 'Sortino Ratio', 
      value: technicalData.sortinoRatio.toFixed(2), 
      description: 'Downside risk-adjusted return'
    },
    { 
      name: 'Expense Ratio', 
      value: `${technicalData.expenseRatio.toFixed(2)}%`, 
      description: 'Annual fund management cost'
    },
    { 
      name: 'Standard Deviation', 
      value: technicalData.standardDeviation.toFixed(2), 
      description: 'Measure of volatility'
    },
    { 
      name: 'Treynor Ratio', 
      value: technicalData.treynorRatio.toFixed(2), 
      description: 'Return per unit of systematic risk'
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1A2332] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Technical Details</DialogTitle>
          <DialogDescription className="text-gray-400">{fundName}</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Metric</TableHead>
                <TableHead className="text-gray-400">Value</TableHead>
                <TableHead className="text-gray-400">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.name} className="border-gray-800 hover:bg-[#0F1419]">
                  <TableCell className="text-white">{metric.name}</TableCell>
                  <TableCell className="text-[#FFAB00]">{metric.value}</TableCell>
                  <TableCell className="text-sm text-gray-400">{metric.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-blue-400">Note:</span> Technical indicators help assess risk-adjusted 
            performance. Higher Sharpe and Sortino ratios indicate better risk-adjusted returns. 
            Beta measures market sensitivity (1.0 = market average).
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}