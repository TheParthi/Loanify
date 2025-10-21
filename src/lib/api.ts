import type { Applicant } from './types';

const API_BASE = 'http://localhost:8080/api';

export const api = {
  applicants: {
    getAll: async (): Promise<Applicant[]> => {
      const response = await fetch(`${API_BASE}/applicants`);
      if (!response.ok) throw new Error('Failed to fetch applicants');
      return response.json();
    },
    
    getById: async (id: string): Promise<Applicant> => {
      const response = await fetch(`${API_BASE}/applicants/${id}`);
      if (!response.ok) throw new Error('Failed to fetch applicant');
      return response.json();
    },
    
    create: async (data: Omit<Applicant, 'id' | 'applicationDate' | 'status'>): Promise<Applicant> => {
      const response = await fetch(`${API_BASE}/applicants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create applicant');
      return response.json();
    },
    
    update: async (id: string, data: Partial<Applicant>): Promise<Applicant> => {
      const response = await fetch(`${API_BASE}/applicants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update applicant');
      return response.json();
    },
    
    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/applicants/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete applicant');
    },
  },
  
  eligibility: {
    check: async (data: {
      creditScore: number;
      annualIncome: number;
      monthlyEmi: number;
      loanAmount: number;
      loanTenure: number;
    }) => {
      const response = await fetch(`${API_BASE}/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to check eligibility');
      return response.json();
    },
  },
};