// store.ts
import { create } from 'zustand';
import { ICompany } from '@/models/company';
import { IUser } from '@/models/user';
import axios from 'axios';

interface CompanyState {
  companies: ICompany[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;

}

interface UserState {
  email: String | null,
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setEmail:(email:String) => Promise<void>
  user: IUser | null;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  loading: true,
  error: null,
  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      set({ companies: jsonData.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Something went wrong',
        loading: false,
      });
    }
  },

}));



export const useUserStore = create<UserState>((set) => ({
  loading: true,
  error: null,
  email: null,
  user: null,
  setEmail: async (email: String) => {
    set({ email: email });
  },
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/watchList');
      if (response.status != 200) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.data['data'];
      set({ user: jsonData.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Something went wrong',
        loading: false,
      });
    }
  },
}));
