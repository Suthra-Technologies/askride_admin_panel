import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/users/Users';
import Verification from './pages/verification/Verification';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';
import VerifyOTP from './pages/auth/VerifyOTP';
import Rides from './pages/rides/Rides';

// Placeholder components for other pages
const Notifications = () => <div className="p-8"><h1 className="text-3xl font-bold dark:text-white">System Notifications</h1><p className="dark:text-slate-400 mt-2">Manage push notifications and email broadcasts.</p></div>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Protected Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<Users />} />
              <Route path="rides" element={<Rides />} />
              <Route path="verification" element={<Verification />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
