import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  storeName: string;
  email: string;
  phone: string;
  profileImageUri?: string;
  storeDescription?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  updatedAt: string;
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateProfileImage: (imageUri: string) => Promise<void>;
  clearProfile: () => void;
  loadProfile: () => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      updateProfile: async (profileData: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentProfile = get().profile;
          const updatedProfile: UserProfile = {
            ...currentProfile,
            ...profileData,
            id: currentProfile?.id || profileData.id || 'temp-id',
            name: profileData.name || currentProfile?.name || '',
            storeName: profileData.storeName || currentProfile?.storeName || '',
            email: profileData.email || currentProfile?.email || '',
            phone: profileData.phone || currentProfile?.phone || '',
            updatedAt: new Date().toISOString(),
          };

          set({ 
            profile: updatedProfile,
            isLoading: false 
          });

          // Here you could also sync with your backend API
          console.log('Profile updated:', updatedProfile);
          
        } catch (error) {
          console.error('Failed to update profile:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false 
          });
          throw error;
        }
      },

      updateProfileImage: async (imageUri: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentProfile = get().profile;
          if (!currentProfile) {
            throw new Error('No profile found');
          }

          const updatedProfile: UserProfile = {
            ...currentProfile,
            profileImageUri: imageUri,
            updatedAt: new Date().toISOString(),
          };

          set({ 
            profile: updatedProfile,
            isLoading: false 
          });

          console.log('Profile image updated:', imageUri);
          
        } catch (error) {
          console.error('Failed to update profile image:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile image',
            isLoading: false 
          });
          throw error;
        }
      },

      clearProfile: () => {
        set({
          profile: null,
          isLoading: false,
          error: null
        });
      },

      loadProfile: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Profile is automatically loaded from AsyncStorage via persist middleware
          // But you could also fetch from your backend API here
          const currentProfile = get().profile;
          
          if (!currentProfile) {
            // Create a default profile if none exists
            const defaultProfile: UserProfile = {
              id: 'temp-id',
              name: 'Test 2',
              storeName: 'Test Store',
              email: 'test@example.com',
              phone: '+91 1234567890',
              updatedAt: new Date().toISOString(),
            };
            
            set({ 
              profile: defaultProfile,
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
          
        } catch (error) {
          console.error('Failed to load profile:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load profile',
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);