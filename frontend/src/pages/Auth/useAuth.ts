import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { login as loginService, register as registerService } from "../../api/services/Auth/auth";
import type { User } from './types';

const useLogin = () => useMutation({ mutationFn: loginService });
const useRegister = () => useMutation({ mutationFn: registerService });

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
      return null;
    }
    return JSON.parse(storedUser);
  } catch (e) {
    console.warn('Failed to parse user from localStorage', e);
    localStorage.removeItem('user');
    return null;
  }
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

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
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return { user, login, register, logout };
};