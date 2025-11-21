import React from 'react';
import { Investor } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface InvestorCardProps {
  investor: Investor;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({ investor, isSelected, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(investor.id)}
      className={`
        relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 select-none
        flex flex-col h-full
        ${isSelected 
          ? 'border-blue-500 bg-blue-50/50 shadow-md' 
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
      `}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 text-blue-500">
          <CheckCircle2 size={20} fill="currentColor" className="text-white" />
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${investor.avatarColor}`}>
          {investor.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 leading-tight">{investor.name}</h3>
          <p className="text-xs text-slate-500 font-medium">{investor.title}</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed mt-auto">
        {investor.description}
      </p>
    </div>
  );
};