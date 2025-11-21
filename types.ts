export interface Investor {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarColor: string;
}

export interface AnalysisResult {
  stockName: string;
  timestamp: number;
  content: string;
  sources?: Array<{ uri: string; title: string }>;
}

export interface HistoryItem {
  stockName: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}