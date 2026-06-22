import axios from 'axios';
import { Tenant, Ticket, DashboardData, TicketCategory, HostelInfo } from '../types';

/**
 * Single source of truth for the backend URL.
 *
 * - In production (Vercel): NEXT_PUBLIC_API_URL = /api/proxy
 *   All requests go browser → /api/proxy/* → Vercel serverless → HTTP backend
 *   This avoids mixed-content blocks entirely.
 *
 * - In local dev: NEXT_PUBLIC_API_URL = http://13.60.202.87:4000/api
 *   Direct calls work fine since localhost is not HTTPS.
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api/proxy';

/** Shared axios instance — all calls go through this */
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Mock data ────────────────────────────────────────────────────────────────

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
  joinDate: '2025-08-15',
};

const MOCK_FACILITIES = [
  'WiFi', 'AC', 'Attached Bathroom', 'Laundry',
  'Food Included', 'Gym Access', 'Power Backup',
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TCK-4819',
    title: 'AC is not cooling properly',
    description:
      'The AC in room A-304 is blowing normal air instead of cool air. It has been happening since yesterday morning.',
    category: 'Electrical',
    status: 'In Progress',
    date: '2026-05-16',
    imageUrl:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop',
  },
  {
    id: 'TCK-4802',
    title: 'Bathroom tap leak',
    description:
      'The water tap in the attached bathroom is leaking continuously, causing water wastage.',
    category: 'Water',
    status: 'Resolved',
    date: '2026-05-12',
  },
  {
    id: 'TCK-4720',
    title: 'Slow internet connection speed',
    description:
      'The internet speed has dropped below 5 Mbps today. Usually it is around 100 Mbps.',
    category: 'Internet',
    status: 'Resolved',
    date: '2026-05-02',
  },
];

const initializeMockData = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('mock_tenant'))
    localStorage.setItem('mock_tenant', JSON.stringify(MOCK_TENANT));
  if (!localStorage.getItem('mock_tickets'))
    localStorage.setItem('mock_tickets', JSON.stringify(MOCK_TICKETS));
  if (!localStorage.getItem('mock_facilities'))
    localStorage.setItem('mock_facilities', JSON.stringify(MOCK_FACILITIES));
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapTicketStatus = (s: string) =>
  s === 'open' ? 'Pending' : s === 'in-progress' ? 'In Progress' : 'Resolved';

const mapApiTicket = (t: any): Ticket => ({
  id: t._id,
  title: t.title,
  description: t.description,
  category: t.category,
  status: mapTicketStatus(t.status) as Ticket['status'],
  date: t.createdAt
    ? new Date(t.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
  imageUrl: t.imageLink || undefined,
});

// ─── Auth service ─────────────────────────────────────────────────────────────

export const authService = {
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; tenant: Tenant }> => {
    initializeMockData();
    await delay(1200);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      return data;
    } catch {
      // Mock fallback — accepts any email + password ≥ 4 chars
      if (email && password.length >= 4) {
        const tenant = JSON.parse(
          localStorage.getItem('mock_tenant') || JSON.stringify(MOCK_TENANT)
        );
        if (email.includes('@')) {
          tenant.email = email;
          tenant.name = email
            .split('@')[0]
            .split('.')
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' ');
        }
        localStorage.setItem('mock_tenant', JSON.stringify(tenant));
        const token = 'mock-jwt-token-xyz-12345';
        localStorage.setItem('tenant_token', token);
        return { token, tenant };
      }
      throw new Error('Invalid email or password (min 4 characters).');
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('tenant_token');
  },
};

// ─── Tenant service ───────────────────────────────────────────────────────────

export const tenantService = {
  /**
   * POST /api/dashboard  — body: { token }
   *
   * Per API spec §12, tenant dashboard auth uses the JWT in the request
   * BODY, not as an Authorization header (which is for owner routes only).
   */
  getDashboard: async (token?: string): Promise<DashboardData> => {
    const activeToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('tenant_token') : null);
    const isLiveToken =
      activeToken && activeToken !== 'mock-jwt-token-xyz-12345';

    if (isLiveToken) {
      try {
        const { data } = await api.post('/dashboard', { token: activeToken });

        const t = data.tenant || {};
        const h = data.hostel || {};
        const r = data.room || {};
        const p = data.payments || {};

        const statusMap: Record<string, string> = {
          pending: 'Pending',
          paid: 'Paid',
          unpaid: 'Unpaid',
          overdue: 'Overdue',
        };

        const mappedTenant: Tenant = {
          id: t.id || 'N/A',
          name: t.name || 'Tenant',
          email: t.email || '',
          phone: t.phoneNumber || '',
          roomNo: r.roomNumber || 'N/A',
          roomType: r.roomType || 'N/A',
          hostelName: h.hostelName || 'Hostel',
          monthlyFee: p.monthlyRent || 0,
          dueAmount: p.totalDues || 0,
          paymentStatus: (statusMap[(t.paymentStatus || '').toLowerCase()] || 'Pending') as any,
          joinDate: t.joinedDate
            ? new Date(t.joinedDate).toISOString().split('T')[0]
            : '',
        };

        const storedFacilities =
          typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('mock_facilities') || '[]')
            : [];

        const hostelMapped: HostelInfo = {
          id: h.id || '',
          hostelName: h.hostelName || '',
          hostelType: h.hostelType || '',
          ownerName: h.ownerName || '',
          email: h.email || '',
          ownerNumber: h.ownerNumber || '',
        };

        const recentTickets = (data.tickets || []).slice(0, 2).map(mapApiTicket);

        return {
          tenant: mappedTenant,
          facilities:
            storedFacilities.length > 0
              ? storedFacilities
              : ['WiFi', 'AC', 'Attached Bathroom', 'Food Included'],
          recentTickets,
          hostel: hostelMapped,
          room: r,
          payments: p,
        };
      } catch (err: any) {
        // 401/404 are expected (stale token) — handle silently via message classification
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.response?.data?.error;

        if (status === 400)
          throw new Error(msg || 'Invalid request. Please re-open your dashboard link.');
        if (status === 401) {
          if (typeof window !== 'undefined') localStorage.removeItem('tenant_token');
          throw new Error(msg || 'Your session has expired. Please use the link from your email.');
        }
        if (status === 404) {
          if (typeof window !== 'undefined') localStorage.removeItem('tenant_token');
          throw new Error(msg || 'Your account was not found. Please contact hostel management.');
        }
        if (status >= 500)
          throw new Error('Server is temporarily unavailable. Please try again in a moment.');

        // Network / no-response error
        throw new Error('Could not reach the server. Check your connection and try again.');
      }
    }
    initializeMockData();
    await delay(1000);
    return {
      tenant: JSON.parse(localStorage.getItem('mock_tenant') || JSON.stringify(MOCK_TENANT)),
      facilities: JSON.parse(localStorage.getItem('mock_facilities') || JSON.stringify(MOCK_FACILITIES)),
      recentTickets: JSON.parse(localStorage.getItem('mock_tickets') || JSON.stringify(MOCK_TICKETS)).slice(0, 2),
    };
  },

  updateProfile: async (profileData: Partial<Tenant>): Promise<Tenant> => {
    initializeMockData();
    await delay(1000);
    try {
      const { data } = await api.put('/tenant/profile', profileData);
      return data;
    } catch {
      const tenant = JSON.parse(
        localStorage.getItem('mock_tenant') || JSON.stringify(MOCK_TENANT)
      );
      const updated = { ...tenant, ...profileData };
      localStorage.setItem('mock_tenant', JSON.stringify(updated));
      return updated;
    }
  },

  /** POST /api/temporary-tenant/submit  (form token as Bearer) */
  register: async (
    tenantData: {
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
    },
    formToken?: string
  ): Promise<void> => {
    const headers = formToken ? { Authorization: `Bearer ${formToken}` } : {};
    await api.post('/temporary-tenant/submit', tenantData, { headers });
  },

  /** GET /api/room/:hostelId  (owner Bearer token) */
  getHostelRooms: async (hostelId: string, ownerToken: string): Promise<any> => {
    try {
      const { data } = await api.get(`/room/${hostelId}`, {
        headers: { Authorization: `Bearer ${ownerToken}` },
      });
      return data;
    } catch {
      // Mock fallback
      return {
        rooms: [
          { _id: 'r1', roomNumber: '101', floorId: { floorNumber: 1 } },
          { _id: 'r2', roomNumber: '102', floorId: { floorNumber: 1 } },
          { _id: 'r3', roomNumber: '201', floorId: { floorNumber: 2 } },
          { _id: 'r4', roomNumber: '202', floorId: { floorNumber: 2 } },
          { _id: 'r5', roomNumber: '301', floorId: { floorNumber: 3 } },
          { _id: 'r6', roomNumber: '302', floorId: { floorNumber: 3 } },
        ],
      };
    }
  },
};

// ─── Ticket service ───────────────────────────────────────────────────────────

export const ticketService = {
  /** POST /api/dashboard/tickets  — body: { token } */
  getTickets: async (token?: string): Promise<Ticket[]> => {
    const activeToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('tenant_token') : null);
    const isLiveToken = activeToken && activeToken !== 'mock-jwt-token-xyz-12345';

    if (isLiveToken) {
      const { data } = await api.post('/dashboard/tickets', { token: activeToken });
      return (data.tickets || []).map(mapApiTicket);
    }

    // Mock fallback
    initializeMockData();
    await delay(1000);
    return JSON.parse(localStorage.getItem('mock_tickets') || JSON.stringify(MOCK_TICKETS));
  },

  /** POST /api/dashboard/ticket  — body: { token, title, category, description, imageLink } */
  raiseTicket: async (
    ticketData: { title: string; description: string; category: TicketCategory; imageUrl?: string },
    token?: string
  ): Promise<Ticket> => {
    const activeToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('tenant_token') : null);
    const isLiveToken = activeToken && activeToken !== 'mock-jwt-token-xyz-12345';

    if (isLiveToken) {
      const { data } = await api.post('/dashboard/ticket', {
        token: activeToken,
        title: ticketData.title,
        category: ticketData.category,
        description: ticketData.description,
        imageLink: ticketData.imageUrl || null,
      });
      return mapApiTicket(data.ticket);
    }

    // Mock fallback
    initializeMockData();
    await delay(1500);
    const tickets = JSON.parse(
      localStorage.getItem('mock_tickets') || JSON.stringify(MOCK_TICKETS)
    );
    const newTicket: Ticket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      imageUrl: ticketData.imageUrl,
    };
    tickets.unshift(newTicket);
    localStorage.setItem('mock_tickets', JSON.stringify(tickets));
    return newTicket;
  },

  uploadImage: async (file: File): Promise<string> => {
    await delay(1000);
    try {
      const form = new FormData();
      form.append('image', file);
      const { data } = await api.post('/tickets/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.imageUrl;
    } catch {
      // Convert to base64 as fallback
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  },
};
