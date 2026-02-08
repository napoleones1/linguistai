
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WordFrequency } from '../types';

interface WordChartProps {
  data: WordFrequency[];
}

export const WordFrequencyChart: React.FC<WordChartProps> = ({ data }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: -20, right: 10 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="word" 
            type="category" 
            width={80} 
            tick={{ fontSize: 10, fill: isDarkMode ? '#64748b' : '#94a3b8', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
              borderRadius: '16px', 
              border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            itemStyle={{ color: isDarkMode ? '#f8fafc' : '#1e293b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
            labelStyle={{ display: 'none' }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={12}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : '#6366f1'} opacity={1 - (index * 0.08)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
