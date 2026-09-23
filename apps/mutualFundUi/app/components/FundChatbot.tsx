'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { mutualFundAPI } from '../lib/api';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface FundChatbotProps {
  onFundsRecommended: (funds: any[]) => void;
}

export function FundChatbot({ onFundsRecommended }: FundChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your AI fund advisor. Tell me about your financial situation and I\'ll recommend the best mutual funds for you. For example: "I want to invest ₹5000 monthly for 5 years in equity funds"',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Extract amount
    const amountMatch = input.match(/₹?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand|lakh|l|crore|cr)?/i);
    let amount = 5000; // default
    if (amountMatch) {
      let num = parseFloat(amountMatch[1].replace(/,/g, ''));
      const unit = amountMatch[0].toLowerCase();
      if (unit.includes('k') || unit.includes('thousand')) num *= 1000;
      if (unit.includes('l') || unit.includes('lakh')) num *= 100000;
      if (unit.includes('cr') || unit.includes('crore')) num *= 10000000;
      amount = num;
    }

    // Extract tenure
    const tenureMatch = input.match(/(\d+)\s*(?:year|yr|month|mon)/i);
    let tenure = 5; // default
    if (tenureMatch) {
      tenure = parseInt(tenureMatch[1]);
      if (input.toLowerCase().includes('month')) tenure = Math.max(1, Math.round(tenure / 12));
    }

    // Extract category
    let category = 'Equity'; // default
    if (lowerInput.includes('debt') || lowerInput.includes('bond')) category = 'Debt';
    if (lowerInput.includes('hybrid') || lowerInput.includes('balanced')) category = 'Hybrid';
    if (lowerInput.includes('equity') || lowerInput.includes('stock')) category = 'Equity';

    // Extract investment type
    let investmentType = 'sip';
    if (lowerInput.includes('lump') || lowerInput.includes('one time')) investmentType = 'lumpsum';

    return { amount, tenure, category, investmentType };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Parse user input
      const { amount, tenure, category, investmentType } = parseUserInput(inputValue);

      // Get AI recommendations
      const recommendations = await mutualFundAPI.getRecommendations({
        amountInvested: amount,
        tenure,
        category,
        investmentType
      });

      // Update funds in parent component
      onFundsRecommended(recommendations);

      // Create bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Perfect! I've updated the fund list with ${recommendations.length} AI-recommended funds for your ${investmentType === 'sip' ? 'monthly' : 'lumpsum'} investment of ₹${amount.toLocaleString('en-IN')} in ${category} funds for ${tenure} years. 🎯\n\nTop recommendation: "${recommendations[0]?.schemeName}" with ${recommendations[0]?.expectedReturn?.toFixed(1)}% expected return. All filters have been cleared to show your personalized results!`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I couldn\'t process your request right now. Please try again or be more specific about your investment amount, duration, and fund type preference.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FFAB00] to-[#FF6D00] hover:from-[#FF9800] hover:to-[#FF5722] text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-[500px] bg-[#1A2332] border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-[#FFAB00] to-[#FF6D00] rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Bot className="size-5 text-[#FFAB00]" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Fund Advisor</h3>
                <p className="text-white/80 text-xs">Get personalized fund recommendations</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-[#FFAB00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="size-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-[#FFAB00] text-black ml-auto'
                      : 'bg-[#0F1419] text-white border border-gray-700'
                  }`}
                >
                  {message.content}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="size-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-[#FFAB00] rounded-full flex items-center justify-center">
                  <Bot className="size-4 text-white" />
                </div>
                <div className="bg-[#0F1419] text-white border border-gray-700 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about funds... e.g., 'I want to invest ₹10000 monthly'"
                className="flex-1 bg-[#0F1419] border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-[#FFAB00] hover:bg-[#FF9800] text-black px-3"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}