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
import ScrollToTop from './components/ScrollToTop';
import { PageSpinner } from './components/ui/Spinner';

// Route-level code splitting keeps the initial bundle small; heavier pages
// (and the date picker / forms they pull in) load on demand.
const Landing = lazy(() => import('./pages/Landing'));
const Browse = lazy(() => import('./pages/Browse'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const CallDetails = lazy(() => import('./pages/CallDetails'));
const NvoPage = lazy(() => import('./pages/NvoPage'));
const CertificatePage = lazy(() => import('./pages/CertificatePage'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const PostsPage = lazy(() => import('./pages/PostsPage'));
const PostPage = lazy(() => import('./pages/PostPage'));
const MentorsPage = lazy(() => import('./pages/MentorsPage'));
const MentorPage = lazy(() => import('./pages/MentorPage'));
const AdminMentorsPage = lazy(() => import('./pages/AdminMentorsPage'));
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
                <ScrollToTop />
                <Suspense fallback={<PageSpinner />}>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Landing />} />
                      <Route path="/calls" element={<Browse />} />
                      <Route path="/kako-funkcionise" element={<HowItWorks />} />
                      <Route path="/calls/:id" element={<CallDetails />} />
                      <Route path="/nvo/:id" element={<NvoPage />} />
                      <Route path="/sertifikat/:code" element={<CertificatePage />} />
                      <Route path="/lider-tabla" element={<Leaderboard />} />
                      <Route path="/kalendar" element={<CalendarPage />} />
                      <Route path="/mapa" element={<MapPage />} />
                      <Route path="/resursi" element={<PostsPage type="resource" />} />
                      <Route path="/blog" element={<PostsPage type="blog" />} />
                      <Route path="/clanci/:slug" element={<PostPage />} />
                      <Route path="/mentori" element={<MentorsPage />} />
                      <Route path="/mentori/:id" element={<MentorPage />} />
                      <Route
                        path="/admin/mentori"
                        element={
                          <ProtectedRoute role="admin">
                            <AdminMentorsPage />
                          </ProtectedRoute>
                        }
                      />
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
