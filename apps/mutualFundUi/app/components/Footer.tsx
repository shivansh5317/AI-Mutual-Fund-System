import React from 'react';
import { TrendingUp, Twitter, Linkedin, Facebook, Instagram, MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    'How It Works',
    'Investment Plans',
    'Risk Assessment',
    'Portfolio Tracker',
    'Tax Calculator',
  ];

  const support = [
    'Help Center',
    'Contact Us',
    'Live Chat',
    'Investment Guide',
    'FAQs',
  ];

  return (
    <footer className="bg-[#0F1419] border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFAB00] to-[#FF6D00] rounded-lg flex items-center justify-center">
                <TrendingUp className="size-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">WealthAI</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering Indian investors with AI-driven mutual fund recommendations for smarter wealth building decisions.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-[#FFAB00] hover:text-black transition-all duration-200">
                <Twitter className="size-4 text-gray-400 hover:text-black" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-[#FFAB00] hover:text-black transition-all duration-200">
                <Linkedin className="size-4 text-gray-400 hover:text-black" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-[#FFAB00] hover:text-black transition-all duration-200">
                <Facebook className="size-4 text-gray-400 hover:text-black" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-[#FFAB00] hover:text-black transition-all duration-200">
                <Instagram className="size-4 text-gray-400 hover:text-black" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#FFAB00] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              {support.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#FFAB00] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="size-4 text-[#FFAB00] mt-1" />
                <span className="text-sm text-gray-400">+91 7906949235</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="size-4 text-[#FFAB00] mt-1" />
                <span className="text-sm text-gray-400">support@wealthai.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-[#FFAB00] mt-1" />
                <span className="text-sm text-gray-400">Greater Noida, Gautam Buddh Nagar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2024 WealthAI. All rights reserved. | SEBI Registered Investment Advisor
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#FFAB00] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FFAB00] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#FFAB00] transition-colors">Disclaimer</a>
            <a href="#" className="hover:text-[#FFAB00] transition-colors">Powered by Readdy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
