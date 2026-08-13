export type JobStatus = 'Open' | 'Pending' | 'Awarded' | 'Rejected' | 'In Progress' | 'Submitted' | 'Verified' | 'Failed';
export type BidStatus = 'Pending' | 'Awarded' | 'Rejected';
export type VerificationStatus = 'pending' | 'pass' | 'fail';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  serviceArea: string;
  serviceRadius: number;
  idProofUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  jobsCompleted: number;
  totalEarned: number;
  photo?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  status: JobStatus;
  aiEstimate: {
    min: number;
    max: number;
    currency: string;
  };
  fundingProgress: number;
  bidCount: number;
  orgId: string;
  orgName: string;
  postedAt: string;
  distance?: number;
}

export interface Bid {
  id: string;
  jobId: string;
  workerId: string;
  price: number;
  etaDays: number;
  note: string;
  planPhoto?: string;
  status: BidStatus;
  submittedAt: string;
  job?: Job;
}

export interface Wallet {
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  jobId: string;
  jobTitle: string;
  amount: number;
  currency: string;
  date: string;
  status: 'Paid' | 'Processing';
}

export interface Review {
  id: string;
  jobId: string;
  jobTitle: string;
  rating: number;
  comment: string;
  from: string;
  date: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  reason?: string;
  beforePhoto?: string;
  afterPhoto?: string;
}