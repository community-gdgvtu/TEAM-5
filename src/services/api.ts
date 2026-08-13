import { Job, Bid, Wallet, Transaction, Review, VerificationResult, Worker } from '../types';

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockJobs: Job[] = [
  {
    id: '1',
    title: 'Broken Street Light on Main St',
    description: 'Street light not working for past 3 days. Safety concern for pedestrians at night.',
    category: 'Electrician',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' },
    photos: ['https://via.placeholder.com/400x300?text=Broken+Light'],
    status: 'Open',
    aiEstimate: { min: 2000, max: 3500, currency: '₹' },
    fundingProgress: 60,
    bidCount: 3,
    orgId: 'org1',
    orgName: 'City Infrastructure Dept',
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    distance: 1.2,
  },
  {
    id: '2',
    title: 'Pothole Repair on Oak Avenue',
    description: 'Large pothole causing traffic issues. Needs immediate repair.',
    category: 'General Labor',
    location: { lat: 40.7138, lng: -74.0070, address: '456 Oak Ave, New York, NY' },
    photos: ['https://via.placeholder.com/400x300?text=Pothole'],
    status: 'Open',
    aiEstimate: { min: 1500, max: 2500, currency: '₹' },
    fundingProgress: 80,
    bidCount: 5,
    orgId: 'org1',
    orgName: 'City Infrastructure Dept',
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    distance: 2.5,
  },
  {
    id: '3',
    title: 'Community Garden Fence Repair',
    description: 'Wooden fence damaged in storm. Needs replacement of 3 sections.',
    category: 'Carpenter',
    location: { lat: 40.7148, lng: -74.0080, address: '789 Garden Rd, New York, NY' },
    photos: ['https://via.placeholder.com/400x300?text=Fence+Damage'],
    status: 'Open',
    aiEstimate: { min: 3000, max: 5000, currency: '₹' },
    fundingProgress: 45,
    bidCount: 2,
    orgId: 'org2',
    orgName: 'Parks & Recreation',
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    distance: 3.8,
  },
];

let mockBids: Bid[] = [
  {
    id: 'bid1',
    jobId: '1',
    workerId: 'worker1',
    price: 2800,
    etaDays: 2,
    note: 'Experienced electrician with all required equipment. Can complete within 2 days.',
    status: 'Pending',
    submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

let mockWallet: Wallet = {
  balance: 12500,
  currency: '₹',
};

let mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    jobId: 'job1',
    jobTitle: 'Pothole Repair - Elm Street',
    amount: 2200,
    currency: '₹',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Paid',
  },
  {
    id: 'tx2',
    jobId: 'job2',
    jobTitle: 'Street Light Replacement',
    amount: 3100,
    currency: '₹',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Processing',
  },
];

let mockReviews: Review[] = [
  {
    id: 'rev1',
    jobId: 'job1',
    jobTitle: 'Pothole Repair - Elm Street',
    rating: 5,
    comment: 'Excellent work, completed on time and great quality.',
    from: 'City Infrastructure Dept',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev2',
    jobId: 'job2',
    jobTitle: 'Street Light Replacement',
    rating: 4,
    comment: 'Good work, slight delay but communication was good.',
    from: 'City Infrastructure Dept',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockWorker: Worker = {
  id: 'worker1',
  name: 'John Contractor',
  phone: '+91 9876543210',
  skills: ['Electrician', 'Plumber', 'General Labor'],
  serviceArea: 'New York, NY',
  serviceRadius: 10,
  verificationStatus: 'verified',
  rating: 4.5,
  jobsCompleted: 12,
  totalEarned: 45000,
};

let mockVerificationResults: { [jobId: string]: VerificationResult } = {};

// API functions
export const api = {
  // Jobs
  getJobs: async (status: string = 'open', near?: { lat: number; lng: number }): Promise<Job[]> => {
    await delay(500);
    let jobs = mockJobs.filter(job => job.status.toLowerCase() === status.toLowerCase());
    if (near) {
      jobs = jobs.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    return jobs;
  },

  getJob: async (jobId: string): Promise<Job> => {
    await delay(300);
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');
    return job;
  },

  submitBid: async (jobId: string, bid: { price: number; etaDays: number; note: string; planPhoto?: string }): Promise<Bid> => {
    await delay(800);
    const newBid: Bid = {
      id: `bid${Date.now()}`,
      jobId,
      workerId: 'worker1',
      price: bid.price,
      etaDays: bid.etaDays,
      note: bid.note,
      planPhoto: bid.planPhoto,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    mockBids.push(newBid);
    
    // Update job bid count
    const jobIndex = mockJobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      mockJobs[jobIndex].bidCount++;
    }
    
    return newBid;
  },

  // Worker Bids
  getWorkerBids: async (workerId: string): Promise<Bid[]> => {
    await delay(400);
    const bids = mockBids.filter(b => b.workerId === workerId);
    // Attach job details to each bid
    return bids.map(bid => ({
      ...bid,
      job: mockJobs.find(j => j.id === bid.jobId),
    }));
  },

  // Job Proof
  submitProof: async (jobId: string, proof: { photoUrl: string; note?: string }): Promise<void> => {
    await delay(1000);
    const jobIndex = mockJobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      mockJobs[jobIndex].status = 'Submitted';
    }
    
    // Initialize verification as pending
    mockVerificationResults[jobId] = {
      status: 'pending',
    };
  },

  // Verification
  getVerification: async (jobId: string): Promise<VerificationResult> => {
    await delay(500);
    return mockVerificationResults[jobId] || { status: 'pending' };
  },

  // Wallet
  getWallet: async (): Promise<Wallet> => {
    await delay(300);
    return mockWallet;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    await delay(400);
    return mockTransactions;
  },

  // Reviews
  getWorkerRatings: async (workerId: string): Promise<{ reviews: Review[]; average: number }> => {
    await delay(400);
    const average = mockReviews.length > 0 
      ? mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length 
      : 0;
    return { reviews: mockReviews, average };
  },

  // Worker Registration
  registerWorker: async (worker: Omit<Worker, 'id' | 'rating' | 'jobsCompleted' | 'totalEarned' | 'verificationStatus'>): Promise<Worker> => {
    await delay(1000);
    const newWorker: Worker = {
      ...worker,
      id: `worker${Date.now()}`,
      rating: 0,
      jobsCompleted: 0,
      totalEarned: 0,
      verificationStatus: 'pending',
    };
    mockWorker = newWorker;
    return newWorker;
  },

  getWorker: async (workerId: string): Promise<Worker> => {
    await delay(300);
    return mockWorker;
  },
};

// For demo purposes - simulate bid being awarded
export const demoAwardBid = async (bidId: string): Promise<void> => {
  await delay(500);
  const bidIndex = mockBids.findIndex(b => b.id === bidId);
  if (bidIndex !== -1) {
    mockBids[bidIndex].status = 'Awarded';
    const jobIndex = mockJobs.findIndex(j => j.id === mockBids[bidIndex].jobId);
    if (jobIndex !== -1) {
      mockJobs[jobIndex].status = 'In Progress';
    }
  }
};

// For demo purposes - simulate verification pass
export const demoPassVerification = async (jobId: string): Promise<void> => {
  await delay(2000);
  mockVerificationResults[jobId] = {
    status: 'pass',
    beforePhoto: 'https://via.placeholder.com/400x300?text=Before',
    afterPhoto: 'https://via.placeholder.com/400x300?text=After',
  };
  
  const jobIndex = mockJobs.findIndex(j => j.id === jobId);
  if (jobIndex !== -1) {
    mockJobs[jobIndex].status = 'Verified';
  }
  
  // Add to wallet
  const job = mockJobs[jobIndex];
  mockWallet.balance += job.aiEstimate.max;
  
  // Add transaction
  mockTransactions.unshift({
    id: `tx${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    amount: job.aiEstimate.max,
    currency: job.aiEstimate.currency,
    date: new Date().toISOString(),
    status: 'Processing',
  });
};