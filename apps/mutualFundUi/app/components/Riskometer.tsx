import React from 'react';

interface RiskometerProps {
  level: 'Low' | 'Low to Moderate' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
}

const riskLevels = [
  { label: 'Low', color: '#00C853', range: [0, 1] },
  { label: 'Low to Moderate', color: '#64DD17', range: [1, 2] },
  { label: 'Moderate', color: '#FFD600', range: [2, 3] },
  { label: 'Moderately High', color: '#FFAB00', range: [3, 4] },
  { label: 'High', color: '#FF6D00', range: [4, 5] },
  { label: 'Very High', color: '#DD2C00', range: [5, 6] },
];

export function Riskometer({ level }: RiskometerProps) {
  const riskIndex = riskLevels.findIndex(r => r.label === level);
  const currentRisk = riskLevels[riskIndex] || riskLevels[2]; // Default to Moderate if not found
  const safeRiskIndex = riskIndex === -1 ? 2 : riskIndex; // Default index to 2 (Moderate)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-16">
        {/* Semi-circle background */}
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background arc segments */}
          {riskLevels.map((risk, index) => {
            const startAngle = 180 - (index * 30);
            const endAngle = 180 - ((index + 1) * 30);
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const radius = 40;
            const centerX = 50;
            const centerY = 50;
            
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY - radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY - radius * Math.sin(endRad);
            
            return (
              <path
                key={index}
                d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 0 ${x2} ${y2} Z`}
                fill={risk.color}
                opacity={index === safeRiskIndex ? 1 : 0.3}
                stroke="white"
                strokeWidth="0.5"
              />
            );
          })}
          
          {/* Needle */}
          <g transform={`rotate(${-safeRiskIndex * 30}, 50, 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="#1A237E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="3" fill="#1A237E" />
          </g>
        </svg>
      </div>
      <div className="text-xs text-center">
        <div style={{ color: currentRisk?.color }}>
          {level}
        </div>
      </div>
    </div>
  );
}