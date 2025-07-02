import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import NewCall from './pages/NewCall';
import CallHistory from './pages/CallHistory';
import BenefitsDetail from './pages/BenefitsDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new-call" element={<NewCall />} />
            <Route path="call-history" element={<CallHistory />} />
            <Route path="benefits/:id" element={<BenefitsDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;