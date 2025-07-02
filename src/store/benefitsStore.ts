import { create } from 'zustand';
import { benefitsService, BenefitsSummary, BenefitsDetail } from '../services/api/benefitsService';

interface BenefitsState {
  benefitsList: BenefitsSummary[];
  currentBenefits: BenefitsDetail | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBenefitsList: () => Promise<void>;
  fetchBenefitsDetail: (id: string) => Promise<void>;
  saveBenefits: (benefits: Partial<BenefitsDetail>) => Promise<string>;
  clearCurrentBenefits: () => void;
  clearError: () => void;
}

export const useBenefitsStore = create<BenefitsState>((set, get) => ({
  benefitsList: [],
  currentBenefits: null,
  isLoading: false,
  error: null,
  
  fetchBenefitsList: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await benefitsService.getBenefitsList();
      set({ benefitsList: data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch benefits list' 
      });
    }
  },
  
  fetchBenefitsDetail: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await benefitsService.getBenefitsDetail(id);
      set({ currentBenefits: data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch benefits details' 
      });
    }
  },
  
  saveBenefits: async (benefits: Partial<BenefitsDetail>) => {
    try {
      set({ isLoading: true, error: null });
      const id = await benefitsService.saveBenefits(benefits);
      
      // Update the local state with the saved data
      if (benefits.id) {
        // If updating an existing item
        set((state) => ({
          benefitsList: state.benefitsList.map(item => 
            item.id === benefits.id 
              ? { 
                  ...item, 
                  patientName: benefits.patientName || item.patientName,
                  insuranceProvider: benefits.insuranceProvider || item.insuranceProvider,
                  // Update other summary fields as needed
                } 
              : item
          ),
          isLoading: false
        }));
      } else {
        // If it's a new item, we would refetch the list
        await get().fetchBenefitsList();
      }
      
      return id;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to save benefits information' 
      });
      throw error;
    }
  },
  
  clearCurrentBenefits: () => {
    set({ currentBenefits: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));