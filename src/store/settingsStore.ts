import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppSettings {
  // View preferences
  defaultViewMode: 'grid' | 'list';
  tasksPerPage: number;
  
  // Display preferences
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showAvatars: boolean;
  
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  dailyDigest: boolean;
  
  // Work preferences
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  autoAssignment: boolean;
  requireApproval: boolean;
  allowReassignment: boolean;
  enableTimeTracking: boolean;
  
  // Team management (for supervisors/admins)
  maxTasksPerEmployee: number;
  defaultTaskPriority: 'low' | 'medium' | 'high' | 'urgent';
  enableEscalation: boolean;
  escalationHours: number;
  requireTaskComments: boolean;
  enableTaskTemplates: boolean;
  allowBulkActions: boolean;
  
  // Communication preferences
  dailyReports: boolean;
  teamNotifications: boolean;
}

interface SettingsStore {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => void;
  getViewMode: () => 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const defaultSettings: AppSettings = {
  // View preferences
  defaultViewMode: 'grid',
  tasksPerPage: 12,
  
  // Display preferences
  theme: 'light',
  compactMode: false,
  showAvatars: true,
  
  // Notification preferences
  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  dailyDigest: false,
  
  // Work preferences
  workingHours: {
    start: '09:00',
    end: '17:00',
    timezone: 'UTC',
  },
  autoAssignment: false,
  requireApproval: false,
  allowReassignment: true,
  enableTimeTracking: false,
  
  // Team management
  maxTasksPerEmployee: 10,
  defaultTaskPriority: 'medium',
  enableEscalation: false,
  escalationHours: 24,
  requireTaskComments: false,
  enableTaskTemplates: false,
  allowBulkActions: true,
  
  // Communication preferences
  dailyReports: false,
  teamNotifications: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      loading: false,

      updateSettings: async (updates: Partial<AppSettings>) => {
        set({ loading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          settings: { ...state.settings, ...updates },
          loading: false,
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      getViewMode: () => {
        return get().settings.defaultViewMode;
      },

      setViewMode: (mode: 'grid' | 'list') => {
        set(state => ({
          settings: { ...state.settings, defaultViewMode: mode }
        }));
      },
    }),
    {
      name: 'app-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);