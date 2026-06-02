import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppShell } from './components/layout/AppShell';
import { Spinner } from './components/ui/Spinner';
import { queryClient } from './lib/queryClient';
import { GlobalStyle } from './theme/GlobalStyle';
import { theme } from './theme/theme';
import { PageLoaderWrap } from './App.styles';

const HomePage = lazy(() =>
  import(/* webpackChunkName: "home" */ './pages/HomePage').then((m) => ({
    default: m.HomePage,
  }))
);
const CsvUploadPage = lazy(() =>
  import(/* webpackChunkName: "upload-csv" */ './pages/CsvUploadPage').then((m) => ({
    default: m.CsvUploadPage,
  }))
);
const PdfUploadPage = lazy(() =>
  import(/* webpackChunkName: "upload-pdf" */ './pages/PdfUploadPage').then((m) => ({
    default: m.PdfUploadPage,
  }))
);
const LogCapturePage = lazy(() =>
  import(/* webpackChunkName: "logs" */ './pages/LogCapturePage').then((m) => ({
    default: m.LogCapturePage,
  }))
);
const TroubleshootPage = lazy(() =>
  import(/* webpackChunkName: "troubleshoot" */ './pages/TroubleshootPage').then((m) => ({
    default: m.TroubleshootPage,
  }))
);

function PageLoader() {
  return (
    <PageLoaderWrap>
      <Spinner aria-label="Loading page" />
    </PageLoaderWrap>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <AppShell>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload/csv" element={<CsvUploadPage />} />
                <Route path="/upload/pdf" element={<PdfUploadPage />} />
                <Route path="/logs" element={<LogCapturePage />} />
                <Route path="/troubleshoot" element={<TroubleshootPage />} />
              </Routes>
            </Suspense>
          </AppShell>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
