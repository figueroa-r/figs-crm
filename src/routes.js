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
import CustomersPageView from './pages/CustomersPageView';
import CustomerContactForm from './pages/customer-contacts/CustomerContactForm';

// sections
import { CustomerBasicInformation } from './sections/@dashboard/customer';
import { CustomerContactsList } from './sections/@dashboard/@customer/customer-contacts';


// mock data for loaders
import customers from './_mock/customer';
import customerContacts from './_mock/customer_contacts';
import customerTickets from './_mock/customerTickets';

// ----------------------------------------------------------------------

export default function Router() {

  const browserRouter = createBrowserRouter([
    {
      path: '/figs-crm',
      element: <DashboardLayout />,
      handle: { crumb: () => 'Figs-CRM'},
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
            crumb: () => 'Customers',
            pageTitle: 'Customers List',
          },
          children: [
            {
              element: <CustomersList />,
              errorElement: <Page404 />,
              loader: customersListLoader,
              index: true,
            },
            { 
              path: 'new',
              element: <>New Customer Form</>,
              handle: { crumb: () => 'New', pageTitle: 'New Customer' }
            },
            {
              path: ':customerId',
              element: <CustomersPageView />,
              loader: ({ params }) => customerLoader(params.customerId),
              handle: { crumb: (loaderData) => loaderData.name, pageTitle: 'Customer Details' },
              children: [
                {element: <CustomerBasicInformation />, errorElement: <Page404 />, index: true, id: 'tabs1' },
                {
                  path: 'contacts',
                  element: <CustomerContactsList />,
                  errorElement: <Page404 />,
                  id: 'tabs2',
                  loader: customerContactsLoader,
                  children: [
                    {
                      path: 'new',
                      element: <CustomerContactForm edit={false} />,
                      errorElement: <Page404 />,
                      handle: { crumb: () => 'New', pageTitle: 'New Contact'}
                    },
                    {
                      path: ':contactId',
                      element: <CustomerContactForm edit />,
                      errorElement: <Page404 />,
                      loader: ({ params }) => singleContactLoader(params.contactId),
                      handle: { crumb: (loaderData) => `${loaderData.firstName} ${loaderData.lastName}`, pageTitle: 'Edit Contact'}
                    }
                  ]
                },
                {
                  path: 'tickets',
                  element: <>Tickets Table</>,
                  errorElement: <Page404 />,
                  id: 'tabs3',
                  loader: customerTicketsLoader
                }
              ]
            }
          ],
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


const customersListLoader = () => customers;
const customerLoader = (customerId) => {
  const filteredArray = customers.filter(customer => customer.id === customerId );
  return filteredArray[0];
}
const customerContactsLoader = () => customerContacts;
const customerTicketsLoader = () => customerTickets;


const singleContactLoader = (contactId) => {
  const filteredArray = customerContacts.filter(contact => contact.id === contactId);
  const singleContact = {...filteredArray[0]};

  return singleContact;
}