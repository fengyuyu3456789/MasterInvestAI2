import React from 'react';
import { HistoryItem } from '../types';
import { History, ChevronRight, Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (stockName: string) => void;
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full lg:w-64 bg-white lg:h-[calc(100vh-5rem)] lg:sticky lg:top-20 border-r border-slate-200 overflow-y-auto p-4 shadow-sm lg:shadow-none rounded-xl lg:rounded-none mb-6 lg:mb-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <History size={16} />
          历史记录
        </h3>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
          >
            <Trash2 size={12} /> 清除
          </button>
        )}
      </div>
      
      <ul className="space-y-2">
        {history.map((item, index) => (
          <li key={`${item.stockName}-${index}`}>
            <button
              onClick={() => onSelect(item.stockName)}
              className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg transition-all group border border-slate-100 hover:border-blue-200"
            >
              <div>
                <span className="font-semibold block">{item.stockName}</span>
                <span className="text-xs text-slate-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};