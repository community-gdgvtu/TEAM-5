import { create } from 'zustand';
import { Worker, Job, Bid, Wallet, Transaction, Review } from '../types';

interface AppState {
  worker: Worker | null;
  jobs: Job[];
  bids: Bid[];
  wallet: Wallet | null;
  transactions: Transaction[];
  reviews: Review[];
  currentJob: Job | null;
  
  setWorker: (worker: Worker | null) => void;
  setJobs: (jobs: Job[]) => void;
  setBids: (bids: Bid[]) => void;
  setWallet: (wallet: Wallet | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setReviews: (reviews: Review[]) => void;
  setCurrentJob: (job: Job | null) => void;
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  updateBidStatus: (bidId: string, status: Bid['status']) => void;
}

export const useStore = create<AppState>((set) => ({
  worker: null,
  jobs: [],
  bids: [],
  wallet: null,
  transactions: [],
  reviews: [],
  currentJob: null,
  
  setWorker: (worker) => set({ worker }),
  setJobs: (jobs) => set({ jobs }),
  setBids: (bids) => set({ bids }),
  setWallet: (wallet) => set({ wallet }),
  setTransactions: (transactions) => set({ transactions }),
  setReviews: (reviews) => set({ reviews }),
  setCurrentJob: (job) => set({ currentJob: job }),
  updateJobStatus: (jobId, status) => set((state) => ({
    jobs: state.jobs.map(job => 
      job.id === jobId ? { ...job, status } : job
    ),
    currentJob: state.currentJob?.id === jobId 
      ? { ...state.currentJob, status } 
      : state.currentJob,
  })),
  updateBidStatus: (bidId, status) => set((state) => ({
    bids: state.bids.map(bid => 
      bid.id === bidId ? { ...bid, status } : bid
    ),
  })),
}));