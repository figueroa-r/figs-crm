import { Navigate, createBrowserRouter } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import CustomersLayout from './layouts/customer';
// pages
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import CustomersList from './pages/customers/CustomersList';
import CustomersPageView from './pages/customers/CustomersPageView';
import CustomerContactForm from './pages/customers/customer-contacts/CustomerContactForm';
import CustomerTicketsList from './pages/customers/customer-tickets/CustomerTicketsList';
import CustomerTicketForm from './pages/customers/customer-tickets/CustomerTicketForm';

// sections
import { CustomerBasicInformation, CustomerForm } from './sections/@dashboard/customer';
import { CustomerContactsList } from './sections/@dashboard/@customer/customer-contacts';


// // mock data for loaders
// import customerContacts from './_mock/customer_contacts';
// import customerTickets from './_mock/customerTickets';

// api for loaders
import { figsCrmAPI } from './service/FigsCRMBackend';

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
        { 
          path: 'customers', 
          element: <CustomersLayout />,
          errorElement: <Page404 />,
          handle: { crumb: () => 'Customers', pageTitle: 'Customers List' },
          children: [
            {
              element: <CustomersList />,
              errorElement: <Page404 />,
              handle: { button: { name: 'New Customer', link: 'new' }},
              index: true,
            },
            { 
              path: 'new',
              element: <CustomerForm edit={false} />,
              handle: { crumb: () => 'New', pageTitle: 'New Customer' }
            },
            {
              path: ':customerId/contacts',
              element: <CustomerContactsList />,
              errorElement: <Page404 />,
              handle: { button: { name: 'New Contact', link: 'new' }}
            },
            {
              path: ':customerId/contacts/new',
              element: <CustomerContactForm />,
              errorElement: <Page404 />
            },
            {
              path: ':customerId/contacts/:contactId',
              element: <CustomerContactForm />,
              errorElement: <Page404 />
            },
            {
              path: ':customerId/tickets',
              element: <CustomerTicketsList />,
              errorElement: <Page404 />
            },
            {
              path: ':customerId/tickets/new',
              element: <CustomerTicketForm isNewTicket />,
              errorElement: <Page404 />
            },
            {
              path: ':customerId/tickets/:ticketId',
              element: <CustomerTicketForm isNewTicket={false},
              errorElement: <Page404 />
            },
          ],
        },
        {
          path: 'about', element: <>about</>
        },
        {
          path: 'contact', element: <>Contact</>
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


/*
{
                  path: 'tickets',
                  element: <CustomerTicketsList />,
                  errorElement: <Page404 />,
                  id: 'tabs3',
                  loader: customerTicketsLoader,
                  handle: { crumb: () => 'Tickets', pageTitle: 'Customer Details', button: {name: 'New Ticket', link: '/new'}},
                  children: [
                    {
                      path: 'new',
                      element: <CustomerTicketForm isNewTicket />,
                      errorElement: <Page404 />,
                      loader: () => ({interactions: [], ticket: {}}),
                      handle: { crumb: () => 'New', pageTitle: 'New Ticket' }
                    },
                    {
                      path: ':ticketId',
                      element: <CustomerTicketForm isNewTicket={false}/>,
                      loader: ({ params }) => singleTicketLoader(params.ticketId),
                      handle: { crumb: (loaderData) => `#${loaderData.id}`, pageTitle: 'View Ticket'}
                    }
                  ]
                }
*/



/*
{
              path: ':customerId',
              element: <CustomersPageView />,
              loader: ({ params }) => figsCrmAPI.getCustomerById(params.customerId),
              handle: { crumb: (loaderData) => loaderData.data.name, pageTitle: 'Customer Details' },
              children: [
                {element: <CustomerBasicInformation />, errorElement: <Page404 />, index: true, id: 'tabs1' },
                {
                  path: 'contacts',
                  element: <CustomerContactsList />,
                  errorElement: <Page404 />,
                  id: 'tabs2',
                  loader: customerContactsLoader,
                  handle: { crumb: () => 'Contacts', pageTitle: 'Customer Details', button: {name: 'New Contact', link: '/new'} },
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
              ]
            },
*/