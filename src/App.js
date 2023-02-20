// react router
import { RouterProvider } from 'react-router-dom';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
// import ScrollToTop from './components/scroll-to-top';
// import { StyledChart } from './components/chart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      {/* <ScrollToTop />
      <StyledChart /> */}
      <RouterProvider router={Router()} />
      {/* <Router /> */}
    </ThemeProvider>
  );
}
