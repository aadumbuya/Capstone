import { create } from 'zustand';
import { seedService } from '../../services/seed-service';

export const useSeedStore = create((set, ) => ({
  seedReports: [],
  isLoading: false,
  error: null,
  
  submitSeedReport: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await seedService.submitSeedReport(payload); 

      let seedId = null;
      if (data.msg && data.msg.includes('Seed ID')) {
        seedId = data.msg.split('Seed ID ')[1];
      };      
      const newSeedReport = {
        id: seedId,
        ...payload.data.seed_details,
        status: "saved",
        submittedAt: new Date().toISOString(),
      };      
      
      set(state => ({
        seedReports: [...state.seedReports, newSeedReport],
        currentSeedId: seedId 
      }));
      
      return { ...data, seedId };
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || 'Failed to submit seed report';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserSeedReports: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await seedService.getUserSeedReports(username);
      const seedReportsArray = response.msg || [];
      set({ seedReports: seedReportsArray });
      return response;
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || 'Failed to fetch user seed reports';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateSeedReport: async (username, seedId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await seedService.updateUserSeedReports(username, seedId, updateData);
      
      set((state) => ({
        seedReports: state.seedReports.map(seed => 
          seed.seed_id === seedId 
            ? { ...seed, ...response } 
            : seed
        ),
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || 'Failed to update seed report';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getInspectorSeedReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await seedService.getInspectorPendingReports();
      const pendingSeeds = data.msg || [];
      set({ 
        inspectorPendingSeeds: pendingSeeds,
        isLoading: false 
      });
      return data;
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || 'Failed to fetch pending seed reports';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateInspectorSeedReports: async (reportData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await seedService.updateInspectorSeedReports(reportData);      
      return response;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.detail || 
                          'Failed to update inspector seed report';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } 
  },

  lockSeed: async (username, seedId, lockedByData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await seedService.lockSeed(username, seedId, lockedByData);
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.detail || 'Failed to lock seed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } 
  },

  checkSeedLock: async (seedId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await seedService.checkSeedLock(seedId);
      set({ isLoading: false });
      return response; 
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.detail || 'Failed to check seed lock status';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  
  clearErrors: () => set({ error: null }),
}));