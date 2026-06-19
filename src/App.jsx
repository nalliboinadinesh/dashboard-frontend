import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HostelsPage from './pages/HostelsPage';
import TenantsPage from './pages/TenantsPage';
import PaymentsPage from './pages/PaymentsPage';
import ExpensesPage from './pages/ExpensesPage';
import TicketsPage from './pages/TicketsPage';

import './App.css';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <DashboardPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hostels"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <HostelsPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <TenantsPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <PaymentsPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ExpensesPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <TicketsPage />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
