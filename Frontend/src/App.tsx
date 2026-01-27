import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { HomePage } from '@/components/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SubmitCodePage } from '@/pages/SubmitCodePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AboutUs } from "@/pages/AboutUs";
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Wrapper components inject the `Maps` function into page components.
// This pattern allows child components to trigger navigation without being
// tightly coupled to the router context.
const PageWrapper = ({ Component, ...props }) => {
  const navigate = useNavigate();
  return <Component onNavigate={(page) => navigate(`/${page}`)} {...props} />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter future={{v7_relativeSplatPath: true,}}>
            <Routes>
              <Route path="/" element={<PageWrapper Component={HomePage} />} />
              <Route path="/login" element={<PageWrapper Component={LoginPage} />} />
              <Route path="/submit" element={<PageWrapper Component={SubmitCodePage} />} />
              <Route path="/history" element={<PageWrapper Component={HistoryPage} />} />
              <Route path="/about" element={<PageWrapper Component={AboutUs} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;