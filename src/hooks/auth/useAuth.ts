import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/auth';

/**
 * Custom hook to access authentication context
 * Provides a convenient way to access authentication state and functions
 */
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;