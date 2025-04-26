import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { ThemeProvider } from './components/theme/theme-provider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BreadcrumbProvider } from './components/breadcrumb/BreadcrumbContext.tsx';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <BreadcrumbProvider>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{ duration: 3000 }}
              richColors
            />
          </BreadcrumbProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
