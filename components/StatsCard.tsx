
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all duration-500 hover:shadow-lg hover:-translate-y-1.5 group cursor-default active:scale-95">
      <div className={`p-3.5 sm:p-4 rounded-xl ${color} text-white shadow-xl shadow-current/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out flex-shrink-0`}>
        {icon}
      </div>
      <div className="text-center sm:text-left min-w-0 flex flex-col justify-center h-full overflow-visible">
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
