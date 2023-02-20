import { Navigate, createBrowserRouter } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import CustomersLayout from './layouts/customer';
//
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import CustomersList from './pages/CustomersList';
// import CustomersPageNewCust from './pages/CustomersPageNewCust'
import CustomersPageView, { customerLoader } from './pages/CustomersPageView';

// sections
import { CustomerBasicInformation } from './sections/@dashboard/customer';
import { CustomerContactsList } from './sections/@dashboard/@customer/customer-contacts';


// mock data for loaders
import customerContacts from './_mock/customer_contacts';
import customerTickets from './_mock/customerTickets';

// ----------------------------------------------------------------------

export default function Router() {

  const browserRouter = createBrowserRouter([
    {
      path: '/figs-crm',
      element: <DashboardLayout />,
      handle: { crumb: 'Figs-CRM'},
      errorElement: <Page404 />,
      children: [
        { element: <Navigate to="/figs-crm/home" />, index: true },
        { path: 'home', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { 
          path: 'customers', 
          element: <CustomersLayout />,
          errorElement: <Page404 />,
          handle: {
            crumb: 'Customers',
            pageTitle: () => 'Customers List',
          },
          children: [
            {
              element: <CustomersList />,
              errorElement: <Page404 />,
              // loader: insertApiCallForCustomerListFunction,
              index: true,
            },
            { 
              path: 'new',
              element: <>New Customer Form</>,
              handle: { crumb: 'New', pageTitle: () => 'New Customer' }
            },
            {
              path: ':customerId',
              element: <CustomersPageView />,
              loader: customerLoader,
              handle: { crumb: 'Details', pageTitle: (loaderData) => loaderData.name},
              children: [
                {element: <CustomerBasicInformation />, errorElement: <Page404 />, index: true },
                {
                  path: 'contacts',
                  element: <CustomerContactsList />,
                  errorElement: <Page404 />,
                  loader: customerContactsLoader
                },
                {
                  path: 'tickets',
                  element: <>Tickets Table</>,
                  errorElement: <Page404 />,
                  loader: customerTicketsLoader
                }
              ]
            }
          ],
        },
        {
          path: '*',
          element: <Page404 />,
          errorElement: <Page404 />
        },
      ],
    },
    {
      path: '/', 
      element: <Navigate to='/figs-crm/home' />, 
      index: true
    },
  ])

  return browserRouter;
}



const customerContactsLoader = () => customerContacts;
const customerTicketsLoader = () => customerTickets;