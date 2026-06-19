'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tenant, Ticket, DashboardData, TicketCategory } from '../types';
import { authService, tenantService, ticketService } from '../services/api';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

interface AuthContextType {
  user: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDashboardLoading: boolean;
  isTicketsLoading: boolean;
  dashboardData: DashboardData | null;
  tickets: Ticket[];
  toasts: Toast[];
  dashboardError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Tenant>) => Promise<void>;
  fetchDashboard: () => Promise<void>;
  fetchTickets: () => Promise<void>;
  raiseTicket: (title: string, description: string, category: TicketCategory, file?: File | null) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isTicketsLoading, setIsTicketsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Toast functions
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Dashboard Data
  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    setIsDashboardLoading(true);
    setDashboardError(null);
    try {
      const data = await tenantService.getDashboard(token);
      setDashboardData(data);
      setUser(data.tenant);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to fetch dashboard data';
      setDashboardError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsDashboardLoading(false);
    }
  }, [token, showToast]);

  // Fetch Tickets
  const fetchTickets = useCallback(async () => {
    if (!token) return;
    setIsTicketsLoading(true);
    try {
      const data = await ticketService.getTickets(token);
      setTickets(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load tickets', 'error');
    } finally {
      setIsTicketsLoading(false);
    }
  }, [token, showToast]);

  // Check login status on load
  useEffect(() => {
    const initAuth = async () => {
      // Do not attempt to initialize token or fetch dashboard on public/standalone registration pages
      if (pathname === '/register-tenant' || pathname === '/add-tenant') {
        setIsLoading(false);
        return;
      }

      let activeToken = null;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryToken = params.get('token');
        if (queryToken) {
          localStorage.setItem('tenant_token', queryToken);
          activeToken = queryToken;
          
          // Clean up URL query parameters
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            url.searchParams.delete('hostelId');
            url.searchParams.delete('tenantId');
            window.history.replaceState({}, '', url.pathname + url.search);
          } catch (e) {
            console.error('Failed to clean URL parameters', e);
          }
        }
      }

      const storedToken = activeToken || localStorage.getItem('tenant_token');
      if (storedToken) {
        try {
          setToken(storedToken);
          setDashboardError(null);
          // Get dashboard data to verify token and load user details
          const data = await tenantService.getDashboard(storedToken);
          setDashboardData(data);
          setUser(data.tenant);
          
          // If on login page, redirect to home
          if (pathname === '/login') {
            router.push('/');
          }
        } catch (err: any) {
          console.error('Session verification failed:', err);
          // If it is a live JWT token, do not clear session, just set the dashboard error
          if (storedToken && storedToken !== 'mock-jwt-token-xyz-12345') {
            setDashboardError(err.message || 'The data is not fetching try after some time');
          } else {
            localStorage.removeItem('tenant_token');
            setToken(null);
            setUser(null);
            if (pathname !== '/login' && pathname !== '/add-tenant' && pathname !== '/register-tenant') {
              router.push('/login');
            }
          }
        }
      } else {
        if (pathname !== '/login' && pathname !== '/add-tenant' && pathname !== '/register-tenant') {
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [pathname, router]);

  // Guard routing when pathname changes
  useEffect(() => {
    if (!isLoading) {
      const storedToken = localStorage.getItem('tenant_token');
      if (!storedToken && pathname !== '/login' && pathname !== '/add-tenant' && pathname !== '/register-tenant') {
        router.push('/login');
      } else if (storedToken && pathname === '/login') {
        router.push('/');
      }
    }
  }, [pathname, isLoading, router]);

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      setUser(response.tenant);
      showToast('Logged in successfully!', 'success');
      router.push('/');
    } catch (err: any) {
      showToast(err.message || 'Invalid email or password', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setDashboardData(null);
    setDashboardError(null);
    setTickets([]);
    showToast('Logged out successfully', 'info');
    router.push('/login');
  }, [router, showToast]);

  // Update Profile
  const updateProfile = async (data: Partial<Tenant>) => {
    try {
      const updatedTenant = await tenantService.updateProfile(data);
      setUser(updatedTenant);
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          tenant: updatedTenant
        });
      }
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  // Raise Ticket
  const raiseTicket = async (title: string, description: string, category: TicketCategory, file?: File | null) => {
    try {
      let imageUrl = '';
      if (file) {
        showToast('Uploading image...', 'info');
        imageUrl = await ticketService.uploadImage(file);
      }

      await ticketService.raiseTicket({
        title,
        description,
        category,
        imageUrl: imageUrl || undefined
      }, token || undefined);

      showToast('Complaint ticket raised successfully!', 'success');
      // Refresh tickets list
      fetchTickets();
      // Also refresh dashboard data since it has recent tickets
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit ticket', 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isDashboardLoading,
        isTicketsLoading,
        dashboardData,
        tickets,
        toasts,
        dashboardError,
        login,
        logout,
        updateProfile,
        fetchDashboard,
        fetchTickets,
        raiseTicket,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
