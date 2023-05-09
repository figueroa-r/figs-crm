import { Navigate, createBrowserRouter } from 'react-router-dom';
// import { sample } from 'lodash';
// layouts
import DashboardLayout from './layouts/dashboard';
import CustomersLayout from './layouts/customer';
import SingleCustomerLayout from './layouts/SingleCustomerLayout';
import CustomerContactsLayout from './layouts/CustomerContactsLayout';
import CustomerTicketsLayout from './layouts/CustomerTicketsLayout';

// pages
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import AboutMe from './pages/AboutMe';
import ContactMeForm from './pages/ContactMeForm';
import TableCustomersList from './pages/TableCustomersList';
import EditCustomerForm from './pages/EditCustomerForm';
import ViewCustomer from './pages/ViewCustomer';
import TableContactsList from './pages/TableContactsList';
import EditContactForm from './pages/EditContactForm';
import ViewContact from './pages/ViewContact';
import TableTicketsList from './pages/TableTicketsList';
import EditTicketForm from './pages/EditTicketForm';
import ViewTicket from './pages/ViewTicket';

// api for loaders
import { getCustomerById } from './service/API-v2/CustomersService';
import { getContactById } from './service/API-v2/ContactsService';
import { getTicketById, getTicketContext } from './service/API-v2/TicketsService';

// ----------------------------------------------------------------------

export default function Router() {

  const browserRouter = createBrowserRouter([
    {
      path: '/figs-crm',
      element: <DashboardLayout />, // Dashboard and Navbar layout component
      handle: { crumb: () => 'Figs-CRM'},
      errorElement: <Page404 />,
      children: [
        { element: <Navigate to="/figs-crm/home" />, index: true },
        { path: 'home', element: <DashboardAppPage /> },
        { path: 'about', element: <AboutMe /> },
        { path: 'contact', element: <ContactMeForm />},
        { 
          path: 'customers', 
          element: <CustomersLayout />, // Customers Breadcrumb component
          errorElement: <Page404 />,
          handle: { crumb: () => 'Customers', pageTitle: 'Customers List', button: { name: 'New Customer', link: 'new' }},
          children: [
            { element: <TableCustomersList />, errorElement: <Page404 />, index: true },
            { path: 'new', element: <EditCustomerForm isNew />, handle: { crumb: () => 'New', pageTitle: 'New Customer' }},
            { path: ':customerId',
              element: <SingleCustomerLayout />, // State management for single customer (basic info, contact/avatar mapping)
              loader: ({ params }) => getCustomerById(params.customerId),
              handle: { crumb: (loaderData) => loaderData.name, pageTitle: 'Customer Details', button: { name: 'Edit Customer', link: 'edit'} },
              children: [
                { element: <ViewCustomer />, errorElement: <Page404 />, index: true, id: 'tabs1' }, // customer view
                { path: 'edit', element: <EditCustomerForm />, errorElement: <Page404 />, handle: { crumb: () => 'Edit', pageTitle: 'Edit Customer' } },
                {
                  path: 'contacts',
                  element: <CustomerContactsLayout />, // simple contacts layout
                  errorElement: <Page404 />,
                  handle: { crumb: () => 'Contacts', pageTitle: 'Customer Details', button: {name: 'New Contact', link: 'new'} },
                  children: [
                    { element: <TableContactsList />, errorElement: <Page404 />, id: 'tabs2', index: true },
                    {
                      path: 'new',
                      element: <EditContactForm isNew />,
                      errorElement: <Page404 />,
                      handle: { crumb: () => 'New', pageTitle: 'New Contact'}
                    },
                    {
                      path: ':contactId',
                      element: <ViewContact />,
                      errorElement: <Page404 />,
                      loader: ({ params }) => getContactById(params.contactId),
                      handle: { crumb: (loaderData) => `${loaderData.firstName} ${loaderData.lastName}`, pageTitle: 'View Contact', button: { name: 'Edit Contact', link: 'edit'} }
                    },
                    {
                      path: ':contactId/edit',
                      element: <EditContactForm />,
                      errorElement: <Page404 />,
                      loader: ({ params }) => getContactById(params.contactId),
                      handle: { crumb: (loaderData) => `${loaderData.firstName} ${loaderData.lastName}`, pageTitle: 'Edit Contact' }
                    }
                  ]
                },
                {
                  path: 'tickets',
                  element: <CustomerTicketsLayout />, // simple tickets layout
                  errorElement: <Page404 />,
                  loader: ({ params }) => getTicketContext(params.customerId),
                  handle: { crumb: () => 'Tickets', pageTitle: 'Customer Details', button: {name: 'New Ticket', link: 'new'}},
                  children: [
                    { element: <TableTicketsList />, errorElement: <Page404 />, id: 'tabs3', index: true },
                    {
                      path: 'new',
                      element: <EditTicketForm isNew />,
                      errorElement: <Page404 />,
                      handle: { crumb: () => 'New', pageTitle: 'New Ticket' }
                    },
                    {
                      path: ':ticketId',
                      element: <ViewTicket />,
                      errorElement: <Page404 />,
                      loader: ({ params }) => getTicketById(params.ticketId),
                      handle: { crumb: (loaderData) => `TICKET-${loaderData.id}`, pageTitle: 'View Ticket', button: { name: 'Edit Ticket', link: 'edit'}}
                    },
                    {
                      path: ':ticketId/edit',
                      element: <EditTicketForm />,
                      errorElement: <Page404 />,
                      loader: ({ params }) => getTicketById(params.ticketId),
                      handle: { crumb: (loaderData) => `TICKET-${loaderData.id}`, pageTitle: 'Edit Ticket'}
                    }
                  ]
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


// const customersListLoader = () => customers;
// const customerLoader = (customerId) => {
//   const filteredArray = customers.filter(customer => customer.id === customerId );
//   return filteredArray[0];
// }


// const customerContactsLoader = () => customerContacts;

// const singleContactLoader = (contactId) => {
//   const filteredArray = customerContacts.filter(contact => contact.id === contactId);
//   const singleContact = {...filteredArray[0]};

//   return singleContact;
// }


// const customerTicketsLoader = () => {
//   const contactsListDto = customerContacts.map(contact => ({id: contact.id, name: `${contact.firstName} ${contact.lastName}`, avatarId: contact.avatarId}))
//   const categoryMap = {
//     '1': {name: 'Engineering', variant: 'primary'},
//     '2': {name: 'Service', variant: 'success'},
//     '3': {name: 'Training', variant: 'error'}
//   }
//   const priorityMap = {
//     '1': {name: 'Low', variant: 'info'},
//     '2': {name: 'Medium', variant: 'success'},
//     '3': {name: 'High', variant: 'warning'},
//     '4': {name: 'Critical', variant: 'error'}
//   }

//   const ticketsWithContact = customerTickets.map(ticket => ({...ticket, primaryContactId: sample(contactsListDto).id}))

//   return {
//     'tickets': ticketsWithContact,
//     'contacts': contactsListDto,
//     'categoryMap': categoryMap,
//     'priorityMap': priorityMap
//   }
// }

// const singleTicketLoader = (ticketId) => {
//   const singleTicket = customerTicketsLoader().tickets.filter(ticket => ticket.id === ticketId)[0];

//   return singleTicket
// }




/*


  loader: figsCrmAPI.getCustomersList,




*/