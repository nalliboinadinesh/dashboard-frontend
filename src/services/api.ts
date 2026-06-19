import axios from 'axios';
import { Tenant, Ticket, DashboardData, TicketCategory, HostelInfo } from '../types';

// Fallback to local storage for fully functional interactive dummy mock data
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.60.202.87:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tenant_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper for Mock Data
const MOCK_TENANT: Tenant = {
  id: 'T-10824',
  name: 'Aryan Sharma',
  email: 'aryan.sharma@example.com',
  phone: '+91 98765 43210',
  roomNo: 'A-304',
  roomType: 'AC',
  hostelName: 'SOSA Elite Living',
  monthlyFee: 12500,
  dueAmount: 0,
  paymentStatus: 'Paid',
  joinDate: '2025-08-15'
};

const MOCK_FACILITIES = ['WiFi', 'AC', 'Attached Bathroom', 'Laundry', 'Food Included', 'Gym Access', 'Power Backup'];

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TCK-4819',
    title: 'AC is not cooling properly',
    description: 'The AC in room A-304 is blowing normal air instead of cool air. It has been happening since yesterday morning. Please send a technician to check it.',
    category: 'Electrical',
    status: 'In Progress',
    date: '2026-05-16',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop'
  },
  {
    id: 'TCK-4802',
    title: 'Bathroom tap leak',
    description: 'The water tap in the attached bathroom is leaking continuously, causing water wastage. Need to change the washer or tap.',
    category: 'Water',
    status: 'Resolved',
    date: '2026-05-12'
  },
  {
    id: 'TCK-4720',
    title: 'Slow internet connection speed',
    description: 'The internet speed has dropped below 5Mbps today. Usually it is around 100Mbps. It is very hard to work or attend lectures.',
    category: 'Internet',
    status: 'Resolved',
    date: '2026-05-02'
  }
];

// Initialize localStorage with dummy mock data if not exists
const initializeMockData = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('mock_tenant')) {
      localStorage.setItem('mock_tenant', JSON.stringify(MOCK_TENANT));
    }
    if (!localStorage.getItem('mock_tickets')) {
      localStorage.setItem('mock_tickets', JSON.stringify(MOCK_TICKETS));
    }
    if (!localStorage.getItem('mock_facilities')) {
      localStorage.setItem('mock_facilities', JSON.stringify(MOCK_FACILITIES));
    }
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; tenant: Tenant }> => {
    initializeMockData();
    await delay(1200); // realistic network delay

    // Try actual API first
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      console.log('API call failed or not configured, falling back to mock authentication', err);
      
      // Simple mock validation (accept any email, check password is not empty)
      if (email && password.length >= 4) {
        const tenant = JSON.parse(localStorage.getItem('mock_tenant') || JSON.stringify(MOCK_TENANT));
        // Customize mock user email if they typed something else
        if (email.includes('@')) {
          tenant.email = email;
          tenant.name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        }
        localStorage.setItem('mock_tenant', JSON.stringify(tenant));
        const token = 'mock-jwt-token-xyz-12345';
        localStorage.setItem('tenant_token', token);
        return { token, tenant };
      } else {
        throw new Error('Invalid email or password (min 4 characters).');
      }
    }
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tenant_token');
    }
  }
};

export const tenantService = {
  getDashboard: async (token?: string): Promise<DashboardData> => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('tenant_token') : null);
    const isLiveToken = activeToken && activeToken !== 'mock-jwt-token-xyz-12345';

    if (isLiveToken) {
      try {
        console.log('Fetching live dashboard data with token:', activeToken);
        const response = await axios.post(`http://13.60.202.87:4000/api/dashboard`, {
          token: activeToken
        });
        
        const data = response.data;
        console.log('Successfully fetched live dashboard data:', data);
        
        const backendTenant = data.tenant || {};
        const backendHostel = data.hostel || {};
        const backendRoom = data.room || {};
        const backendPayments = data.payments || {};

        const paymentStatusMap: Record<string, string> = {
          'pending': 'Pending',
          'paid': 'Paid',
          'unpaid': 'Unpaid',
          'overdue': 'Overdue'
        };

        const rawStatus = (backendTenant.paymentStatus || '').toLowerCase();
        const mappedStatus = paymentStatusMap[rawStatus] || 'Pending';

        const mappedTenant: Tenant = {
          id: backendTenant.id || 'N/A',
          name: backendTenant.name || 'Tenant',
          email: backendTenant.email || '',
          phone: backendTenant.phoneNumber || '',
          roomNo: backendRoom.roomNumber || 'N/A',
          roomType: backendRoom.roomType || 'N/A',
          hostelName: backendHostel.hostelName || 'Hostel',
          monthlyFee: backendPayments.monthlyRent || 0,
          dueAmount: backendPayments.totalDues || 0,
          paymentStatus: mappedStatus as any,
          joinDate: backendTenant.joinedDate ? new Date(backendTenant.joinedDate).toISOString().split('T')[0] : ''
        };

        const tickets = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('mock_tickets') || '[]') : [];
        const facilities = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('mock_facilities') || '[]') : ['WiFi', 'AC', 'Attached Bathroom', 'Food Included'];

        const backendHostelMapped: HostelInfo = {
          id: backendHostel.id || '',
          hostelName: backendHostel.hostelName || '',
          hostelType: backendHostel.hostelType || '',
          ownerName: backendHostel.ownerName || '',
          email: backendHostel.email || '',
          ownerNumber: backendHostel.ownerNumber || ''
        };

        return {
          tenant: mappedTenant,
          facilities: facilities.length > 0 ? facilities : ['WiFi', 'AC', 'Attached Bathroom', 'Food Included'],
          recentTickets: tickets.slice(0, 2),
          hostel: backendHostelMapped,
          room: backendRoom,
          payments: backendPayments
        };
      } catch (err: any) {
        console.error('API call failed in tenantService.getDashboard:', err);
        throw new Error('The data is not fetching try after some time');
      }
    }

    // Default mock data fallback
    initializeMockData();
    await delay(1000);

    try {
      const response = await api.get('/tenant/dashboard');
      return response.data;
    } catch (err) {
      console.log('API call failed, falling back to mock dashboard data', err);
      const tenant = JSON.parse(localStorage.getItem('mock_tenant') || JSON.stringify(MOCK_TENANT));
      const tickets = JSON.parse(localStorage.getItem('mock_tickets') || JSON.stringify(MOCK_TICKETS));
      const facilities = JSON.parse(localStorage.getItem('mock_facilities') || JSON.stringify(MOCK_FACILITIES));

      return {
        tenant,
        facilities,
        recentTickets: tickets.slice(0, 2)
      };
    }
  },

  updateProfile: async (profileData: Partial<Tenant>): Promise<Tenant> => {
    initializeMockData();
    await delay(1000);

    try {
      const response = await api.put('/tenant/profile', profileData);
      return response.data;
    } catch (err) {
      console.log('API call failed, falling back to mock update profile', err);
      const tenant = JSON.parse(localStorage.getItem('mock_tenant') || JSON.stringify(MOCK_TENANT));
      const updatedTenant = { ...tenant, ...profileData };
      localStorage.setItem('mock_tenant', JSON.stringify(updatedTenant));
      return updatedTenant;
    }
  },

  register: async (tenantData: {
    floorNumber: number;
    roomNumber: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    parentNumber: string;
    aadhaarNumber: string;
    occupation: string;
    joinedDate: string;
    monthlyFee: number;
    deposit: number;
  }, token?: string): Promise<void> => {
    await delay(1500);
    console.log('Initiating POST request to backend...');
    console.log('URL: http://13.60.202.87:4000/api/temporary-tenant/submit');
    console.log('Payload:', tenantData);
    console.log('Token present:', !!token);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post('http://13.60.202.87:4000/api/temporary-tenant/submit', tenantData, { headers });
      console.log('POST request succeeded with status:', response.status);
    } catch (err: any) {
      console.error('API call failed in tenantService.register:', err);
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
      }
      throw err;
    }
  },

  getHostelRooms: async (hostelId: string, token: string): Promise<any> => {
    try {
      const response = await axios.get(`http://13.60.202.87:4000/api/room/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      console.log('Failed to fetch rooms from hostelmanegemnt API, falling back to mock rooms:', err);
      return {
        rooms: [
          { _id: 'r1', roomNumber: '101', floorId: { floorNumber: 1 } },
          { _id: 'r2', roomNumber: '102', floorId: { floorNumber: 1 } },
          { _id: 'r3', roomNumber: '201', floorId: { floorNumber: 2 } },
          { _id: 'r4', roomNumber: '202', floorId: { floorNumber: 2 } },
          { _id: 'r5', roomNumber: '301', floorId: { floorNumber: 3 } },
          { _id: 'r6', roomNumber: '302', floorId: { floorNumber: 3 } }
        ]
      };
    }
  }
};

export const ticketService = {
  getTickets: async (token?: string): Promise<Ticket[]> => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('tenant_token') : null);
    const isLiveToken = activeToken && activeToken !== 'mock-jwt-token-xyz-12345';

    if (isLiveToken) {
      try {
        const response = await axios.post(`http://13.60.202.87:4000/api/dashboard/tickets`, {
          token: activeToken
        });
        const tickets = response.data.tickets || [];
        return tickets.map((t: any) => ({
          id: t._id,
          title: t.title,
          description: t.description,
          category: t.category,
          status: t.status === 'open' ? 'Pending' : t.status === 'in-progress' ? 'In Progress' : 'Resolved',
          date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          imageUrl: t.imageLink || undefined
        }));
      } catch (err: any) {
        console.error('Failed to fetch live tickets:', err);
        throw new Error('Failed to load tickets. Please try again later.');
      }
    }

    initializeMockData();
    await delay(1000);

    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (err) {
      console.log('API call failed, falling back to mock tickets retrieval', err);
      return JSON.parse(localStorage.getItem('mock_tickets') || JSON.stringify(MOCK_TICKETS));
    }
  },

  raiseTicket: async (ticketData: { title: string; description: string; category: TicketCategory; imageUrl?: string }, token?: string): Promise<Ticket> => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('tenant_token') : null);
    const isLiveToken = activeToken && activeToken !== 'mock-jwt-token-xyz-12345';

    if (isLiveToken) {
      try {
        const response = await axios.post(`http://13.60.202.87:4000/api/dashboard/ticket`, {
          token: activeToken,
          title: ticketData.title,
          category: ticketData.category,
          description: ticketData.description,
          imageLink: ticketData.imageUrl || null
        });
        const t = response.data.ticket;
        return {
          id: t._id,
          title: t.title,
          description: t.description,
          category: t.category,
          status: t.status === 'open' ? 'Pending' : t.status === 'in-progress' ? 'In Progress' : 'Resolved',
          date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          imageUrl: t.imageLink || undefined
        };
      } catch (err: any) {
        console.error('Failed to raise live ticket:', err);
        throw new Error('Failed to raise ticket. Please try again later.');
      }
    }

    initializeMockData();
    await delay(1500);

    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (err) {
      console.log('API call failed, falling back to mock ticket raise', err);
      const tickets = JSON.parse(localStorage.getItem('mock_tickets') || JSON.stringify(MOCK_TICKETS));
      
      const newTicket: Ticket = {
        id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        imageUrl: ticketData.imageUrl
      };

      tickets.unshift(newTicket);
      localStorage.setItem('mock_tickets', JSON.stringify(tickets));
      return newTicket;
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    await delay(1000);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/tickets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (err) {
      console.log('API call failed, converting image to base64 mock URL', err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }
};
