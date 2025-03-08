import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that wraps your app and makes auth available
export const AuthProvider = ({ children }) => {
  // Default credentials
  const defaultUsername = 'happybirthday_user';
  const defaultPassword = 'Thank_You';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastPath, setLastPath] = useState('/');

  // Check if user is already logged in (e.g., from localStorage)
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        
        // Retrieve the last path from localStorage if available
        const savedPath = localStorage.getItem('lastPath');
        if (savedPath) {
          setLastPath(savedPath);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Save the last path the user visited
  const saveLastPath = (path) => {
    // Don't save login path
    if (path !== '/login') {
      setLastPath(path);
      localStorage.setItem('lastPath', path);
    }
  };

  // Get the path to redirect to after login - MODIFIED to always go to ThankYou
  const getRedirectPath = () => {
    // Always redirect to ThankYou page after successful login
    return '/ThankYou';
  };

  // Login function - Replace with actual authentication logic
  const login = async (usernameOrPassword, password = null) => {
    try {
      setLoading(true);
      
      // For demo purposes - replace with real authentication
      // If both username and password are provided
      if (password) {
        // Check for default credentials
        if ((usernameOrPassword === defaultUsername && password === defaultPassword) || 
            (usernameOrPassword === 'birthday' && password === 'surprise')) {
          const userData = {
            username: usernameOrPassword,
            name: usernameOrPassword === defaultUsername ? 'Birthday User' : 'Birthday User',
          };
          
          // Save to localStorage and state
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          
          // Save /ThankYou as the last path
          saveLastPath('/ThankYou');
          
          return true;
        }
        return false;
      } 
      // If only a password is provided (secret code mode)
      else {
        // Demo secret code - replace with your actual secret code
        if (usernameOrPassword === 'happybirthday') {
          const userData = {
            username: 'guest',
            name: 'Birthday Guest',
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    // Don't remove lastPath to enable returning after re-login
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    saveLastPath,
    getRedirectPath,
    lastPath,
    defaultUsername // Add default username to context so it can be used in login forms
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
