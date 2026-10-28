import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Transaction, User } from '../types';

interface ActivityChartProps {
  transactions: Transaction[];
  user: User;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ transactions, user }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [chartType, setChartType] = useState<'balance' | 'performance'>('balance');

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy prior chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Create purple gradient for area fill
    const purpleGradient = ctx.createLinearGradient(0, 0, 0, 180);
    purpleGradient.addColorStop(0, 'rgba(124, 58, 237, 0.45)');
    purpleGradient.addColorStop(1, 'rgba(124, 58, 237, 0.02)');

    const greenGradient = ctx.createLinearGradient(0, 0, 0, 180);
    greenGradient.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
    greenGradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

    // Generate last 7 days labels
    const days: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
    }

    // Default trend data
    const depositTrend = [50, 100, 50, 150, 50, 200, user.wallet.deposit || 250];
    const winningTrend = [20, 80, 120, 90, 180, 310, user.wallet.winning || 360];

    const killsData = [2, 5, 3, 7, 4, 8, user.stats.totalKills || 6];
    const matchesData = [1, 2, 1, 3, 2, 3, user.stats.matchesPlayed || 2];

    if (chartType === 'balance') {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Winnings (₹)',
              data: winningTrend,
              borderColor: '#10b981',
              backgroundColor: greenGradient,
              borderWidth: 2,
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#000',
              pointHoverRadius: 5,
            },
            {
              label: 'Deposits (₹)',
              data: depositTrend,
              borderColor: '#7c3aed',
              backgroundColor: purpleGradient,
              borderWidth: 2,
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#a855f7',
              pointBorderColor: '#000',
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: { size: 10, weight: 'bold' },
                boxWidth: 10,
                boxHeight: 10,
              },
            },
            tooltip: {
              backgroundColor: '#18181b',
              titleColor: '#fff',
              bodyColor: '#e4e4e7',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 8,
              cornerRadius: 8,
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: { size: 9 },
              },
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: { size: 9 },
                callback: (value) => `₹${value}`,
              },
            },
          },
        },
      });
    } else {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Kills',
              data: killsData,
              backgroundColor: '#f97316',
              borderRadius: 6,
            },
            {
              label: 'Matches',
              data: matchesData,
              backgroundColor: '#8b5cf6',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: { size: 10, weight: 'bold' },
                boxWidth: 10,
                boxHeight: 10,
              },
            },
            tooltip: {
              backgroundColor: '#18181b',
              titleColor: '#fff',
              bodyColor: '#e4e4e7',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 8,
              cornerRadius: 8,
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: { size: 9 },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: { size: 9 },
                stepSize: 1,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartType, transactions, user]);

  return (
    <div className="bg-[#121212] p-4 rounded-xl border border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[13px] text-white flex items-center gap-1.5">
          <span>📊</span>
          <span>Recent Activity & Analytics</span>
        </h3>
        
        {/* Toggle between Cashflow & Performance */}
        <div className="flex bg-[#1e1e1e] p-0.5 rounded-lg border border-white/10 text-[10px]">
          <button
            type="button"
            onClick={() => setChartType('balance')}
            className={`px-2 py-1 rounded transition-colors font-bold ${
              chartType === 'balance' ? 'bg-[#7c3aed] text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            Cash Flow (₹)
          </button>
          <button
            type="button"
            onClick={() => setChartType('performance')}
            className={`px-2 py-1 rounded transition-colors font-bold ${
              chartType === 'performance' ? 'bg-[#7c3aed] text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            Kills & Matches
          </button>
        </div>
      </div>

      {/* Mini metric counters */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
        <div className="bg-black/50 p-2 rounded-lg border border-white/5">
          <span className="text-[9px] text-white/50 block font-sans">Deposit Vol</span>
          <span className="text-xs font-bold text-purple-400">₹{user.wallet.deposit + 200}</span>
        </div>
        <div className="bg-black/50 p-2 rounded-lg border border-white/5">
          <span className="text-[9px] text-white/50 block font-sans">Total Won</span>
          <span className="text-xs font-bold text-emerald-400">₹{user.wallet.winning + 360}</span>
        </div>
        <div className="bg-black/50 p-2 rounded-lg border border-white/5">
          <span className="text-[9px] text-white/50 block font-sans">Booyah Rate</span>
          <span className="text-xs font-bold text-amber-400">68%</span>
        </div>
      </div>

      {/* Canvas container with Chart.js */}
      <div className="relative h-44 w-full pt-1">
        <canvas ref={canvasRef} id="activityChart" className="w-full h-full" />
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5 font-mono">
        <span>● Auto-updated with transactions</span>
        <span>PhonePe / Free Fire MAX</span>
      </div>
    </div>
  );
};
