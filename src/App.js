// react router
import { RouterProvider } from 'react-router-dom';

// Luxon localization provider
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
// import ScrollToTop from './components/scroll-to-top';


// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      {/* <ScrollToTop /> */}
      <LocalizationProvider dateAdapter={AdapterLuxon}>
      <RouterProvider router={Router()} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
