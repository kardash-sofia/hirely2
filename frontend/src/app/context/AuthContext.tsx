import { createContext, useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login as loginService, register as registerService } from '../../api/services/Auth/auth';
import type { User } from '../../pages/Auth/types';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<unknown>;
  register: (email: string, password: string, fullName: string, role: string) => Promise<unknown>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginMutation = useMutation({ mutationFn: loginService });
  const registerMutation = useMutation({ mutationFn: registerService });

  const login = async (email: string, password: string) => {
    const res = await loginMutation.mutateAsync({ email, password });

    setUser(res.user);

    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res;
  };

  const register = async (email: string, password: string, fullName: string, role: string) => {
    return await registerMutation.mutateAsync({ email, password, fullName, role });
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
