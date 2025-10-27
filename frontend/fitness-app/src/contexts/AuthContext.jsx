import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// API service functions
const authAPI = {
  // Register a new user with Firebase
  register: async (userData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: `${userData.first_name} ${userData.last_name}`.trim()
      });
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Register user in Django backend/Firestore
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name
        }),
      });
      
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          const errorMessage = errorData.errors 
            ? Object.values(errorData.errors).flat().join(', ')
            : errorData.error || 'Registration failed';
          throw new Error(errorMessage);
        } else {
          const text = await response.text();
          throw new Error(text || 'Registration failed');
        }
      }
      
      return response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user with Firebase
  login: async (email, password) => {
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Get user data from backend
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ email, password }),
      });
      
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          const errorMessage = errorData.errors 
            ? Object.values(errorData.errors).flat().join(', ')
            : errorData.error || 'Login failed';
          throw new Error(errorMessage);
        } else {
          const text = await response.text();
          throw new Error(text || 'Login failed');
        }
      }
      
      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get user profile from backend
  getProfile: async (idToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  // Update user profile
  updateProfile: async (idToken, profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Profile update failed');
    }
    
    return response.json();
  },

  // Change password
  changePassword: async (idToken, passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Password change failed');
    }
    
    return response.json();
  },

  // Make authenticated requests
  authenticatedRequest: async (url, options = {}, idToken) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${idToken}`,
      },
    });
    
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    
    return response;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          try {
            // Get Firebase ID token
            const token = await firebaseUser.getIdToken();
            setIdToken(token);
            
            // Fetch user profile from backend
            try {
              const profileData = await authAPI.getProfile(token);
              if (profileData.success) {
                setUser(profileData.user);
                localStorage.setItem('user', JSON.stringify(profileData.user));
              }
            } catch (error) {
              console.error('Failed to fetch profile:', error);
              // Set basic user info from Firebase
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName
              });
            }
          } catch (error) {
            console.error('Error getting token:', error);
            // Set basic user info even if token fails
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName
            });
          }
        } else {
          // User is signed out
          setUser(null);
          setIdToken(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Ensure loading is set to false even on error
        setUser(null);
        setIdToken(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const clearAuth = () => {
    setUser(null);
    setIdToken(null);
    localStorage.removeItem('user');
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await authAPI.updateProfile(idToken, profileData);
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const data = await authAPI.changePassword(idToken, passwordData);
      return { success: data.success };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    try {
      // Refresh token to ensure it's valid
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        return await authAPI.authenticatedRequest(url, options, token);
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      if (error.message === 'UNAUTHORIZED' || error.message === 'User not authenticated') {
        clearAuth();
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  };

  const value = {
    user,
    idToken,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    makeAuthenticatedRequest,
    isAuthenticated: !!user && !!idToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

