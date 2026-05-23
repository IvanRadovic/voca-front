import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { PageSpinner } from './components/ui/Spinner';

// Route-level code splitting keeps the initial bundle small; heavier pages
// (and the date picker / forms they pull in) load on demand.
const Landing = lazy(() => import('./pages/Landing'));
const Browse = lazy(() => import('./pages/Browse'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const CallDetails = lazy(() => import('./pages/CallDetails'));
const NvoPage = lazy(() => import('./pages/NvoPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <ModalProvider>
                <Suspense fallback={<PageSpinner />}>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Landing />} />
                      <Route path="/calls" element={<Browse />} />
                      <Route path="/kako-funkcionise" element={<HowItWorks />} />
                      <Route path="/calls/:id" element={<CallDetails />} />
                      <Route path="/nvo/:id" element={<NvoPage />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute role="nvo">
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute role="youth">
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </ModalProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
