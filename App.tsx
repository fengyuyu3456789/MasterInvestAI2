import React, { useState, useEffect } from 'react';
import { INVESTORS } from './constants';
import { HistoryItem, LoadingState, AnalysisResult } from './types';
import { generateStockAnalysis } from './services/geminiService';
import { HistorySidebar } from './components/HistorySidebar';
import { InvestorCard } from './components/InvestorCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Search, TrendingUp, BrainCircuit, Link as LinkIcon, AlertCircle, CheckSquare, Square } from 'lucide-react';

export default function App() {
  // State
  const [query, setQuery] = useState('');
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>(INVESTORS.map(i => i.id));
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('stock_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Toggle Investor
  const toggleInvestor = (id: string) => {
    setSelectedInvestors(prev => {
      if (prev.includes(id)) {
        // If unchecking the last one, don't allow it (optional UX choice, but good for logic)
        // Actually, user might want to clear all to select one. Let's allow empty but disable button.
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Select All Logic
  const isAllSelected = selectedInvestors.length === INVESTORS.length;
  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedInvestors([]);
    } else {
      setSelectedInvestors(INVESTORS.map(i => i.id));
    }
  };

  // Handle Analysis
  const handleAnalyze = async (stockName: string) => {
    if (!stockName.trim()) return;
    if (selectedInvestors.length === 0) {
      setErrorMsg("请至少选择一位投资大师进行分析");
      return;
    }

    setLoadingState(LoadingState.LOADING);
    setResult(null);
    setErrorMsg(null);
    // Update query in input if clicked from history
    setQuery(stockName); 

    try {
      const response = await generateStockAnalysis({
        stockName,
        selectedInvestorIds: selectedInvestors
      });

      const newResult: AnalysisResult = {
        stockName,
        timestamp: Date.now(),
        content: response.text || "分析未返回内容，请重试。",
        sources: response.sources
      };

      setResult(newResult);
      setLoadingState(LoadingState.SUCCESS);

      // Update History
      setHistory(prev => {
        const filtered = prev.filter(item => item.stockName !== stockName);
        const newHistory = [{ stockName, timestamp: Date.now() }, ...filtered].slice(0, 10);
        localStorage.setItem('stock_history', JSON.stringify(newHistory));
        return newHistory;
      });

    } catch (error: any) {
      setLoadingState(LoadingState.ERROR);
      setErrorMsg(error.message || "分析过程中发生错误，请检查网络或API Key设置。");
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('stock_history');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BrainCircuit size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">智投大师 <span className="text-slate-400 font-normal text-sm ml-2 hidden sm:inline">基本面分析系统</span></h1>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: History (Desktop Sticky) */}
          <aside className="hidden lg:block">
             <HistorySidebar history={history} onSelect={handleAnalyze} onClear={handleClearHistory} />
          </aside>

          {/* Mobile History (Collapsible handled simply by flow for now or strictly separate component if complex) */}
          {/* For this scope, we just put it above on mobile via flex-col direction */}
          <div className="lg:hidden w-full">
            <HistorySidebar history={history} onSelect={handleAnalyze} onClear={handleClearHistory} />
          </div>

          {/* Center: Main Content */}
          <div className="flex-1">
            
            {/* Search Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                输入股票代码或名称 (A股/港股)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="例如：腾讯控股 (0700), 贵州茅台 (600519)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(query)}
                  />
                </div>
                <button
                  onClick={() => handleAnalyze(query)}
                  disabled={loadingState === LoadingState.LOADING || !query.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                  {loadingState === LoadingState.LOADING ? '分析中...' : '开始分析'}
                  {loadingState !== LoadingState.LOADING && <TrendingUp size={18} />}
                </button>
              </div>
            </section>

            {/* Investors Selection */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">选择分析视角</h2>
                <button 
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
                >
                  {isAllSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  {isAllSelected ? '取消全选' : '全选大师'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {INVESTORS.map(investor => (
                  <InvestorCard
                    key={investor.id}
                    investor={investor}
                    isSelected={selectedInvestors.includes(investor.id)}
                    onToggle={toggleInvestor}
                  />
                ))}
              </div>
            </section>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-red-800 text-sm">发生错误</h3>
                  <p className="text-red-700 text-sm">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {loadingState === LoadingState.LOADING && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[400px] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}

            {loadingState === LoadingState.SUCCESS && result && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{result.stockName}</h2>
                      <p className="text-sm text-slate-500 mt-1">
                        分析生成时间: {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      AI Generated
                    </div>
                  </div>
                  
                  <div className="p-8 prose prose-slate prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-800 max-w-none">
                    {/* Simple Markdown Rendering Strategy: Using whitespace-pre-wrap and basic formatting */}
                    <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                        {/* We are relying on the model to produce clean Markdown. 
                            In a real production app, we would use 'react-markdown'.
                            Here we render raw text but styled. To make it look like markdown without the lib, 
                            we can use a simple split or just display safely. 
                            Given constraints, we display text. The model instruction asks for Markdown.
                            Let's assume users can read MD or we use a very simple parser.
                        */}
                        {result.content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>
                            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3 pb-2 border-b border-slate-100">{line.replace('## ', '')}</h2>
                            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-5 mb-2">{line.replace('### ', '')}</h3>
                            if (line.startsWith('- **')) {
                                const parts = line.split('**');
                                return <li key={i} className="ml-4 my-2 list-disc"><strong className="text-slate-900">{parts[1]}</strong>{parts[2]}</li>
                            }
                            if (line.startsWith('- ')) return <li key={i} className="ml-4 my-1 list-disc">{line.replace('- ', '')}</li>
                            if (line.startsWith('1. ')) return <li key={i} className="ml-4 my-2 list-decimal font-semibold text-lg mt-4">{line.replace(/^\d+\.\s/, '')}</li>
                            if (line.trim() === '') return <br key={i} />
                            return <p key={i} className="my-2">{line.replace(/\*\*/g, '')}</p>
                        })}
                    </div>
                  </div>

                  {/* Sources */}
                  {result.sources && result.sources.length > 0 && (
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                      <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <LinkIcon size={14} /> 参考来源 (Grounding)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.sources.map((source, idx) => (
                          <a 
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-white border border-slate-200 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors truncate max-w-[200px]"
                            title={source.title}
                          >
                            {source.title || new URL(source.uri).hostname}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}