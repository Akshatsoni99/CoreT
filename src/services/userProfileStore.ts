/**
 * User Profile Store — Clean, persistent citizen profile without fake demo defaults.
 */

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  dob: string; // YYYY-MM-DD or DD/MM/YYYY
  gender: string;
  address: string;
}

const STORAGE_KEY = 'coreserve_user_profile';

// Empty default profile — NEVER fake identity data
export const emptyUserProfile: UserProfile = {
  name: '',
  phone: '',
  email: '',
  dob: '',
  gender: '',
  address: ''
};

export function getUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...emptyUserProfile,
        ...parsed
      };
    }
  } catch (e) {
    console.warn('Error reading user profile from localStorage:', e);
  }
  return { ...emptyUserProfile };
}

export function setUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated: UserProfile = {
    ...current,
    ...profile
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('coreserve_profile_updated', { detail: updated }));
  } catch (e) {
    console.error('Error saving user profile to localStorage:', e);
  }
  return updated;
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('coreserve_profile_updated', { detail: emptyUserProfile }));
  } catch (e) {
    console.error('Error clearing user profile:', e);
  }
}
