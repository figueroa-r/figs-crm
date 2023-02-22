import { useState } from 'react';
import { NavLink, Outlet, useLoaderData, useMatches } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Tab,
  Tabs,
  Zoom
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';
// sections
// import { CustomerBasicInformation } from '../sections/@dashboard/customer';
// mock
// import CUSTOMERLIST from '../_mock/customer';

// ----------------------------------------------------------------------

export default function CustomersPageView() {

  // for now we have our customer data as the first customer in our mock data...
  const CURRENT_CUSTOMER = useLoaderData();

  // print our location
  // const currentLocation = useLocation();
  // console.log(currentLocation);
  const currentMatches = useMatches();
  const tabsNavigator = currentMatches[currentMatches.length - 1].id.indexOf('tabs') !== -1;
  console.log(tabsNavigator);


  const [value, setValue] = useState('1');



  return (
    <>
      <Helmet>
        <title> Customers: {CURRENT_CUSTOMER.name} | Figs-CRM </title>
      </Helmet>

        {
          tabsNavigator && <Zoom in timeout={{enter: 500}}><div>
          <Card sx={{p: 2, mb: 2}}>
              <Scrollbar>
              <Tabs value={value}>
                <Tab component={NavLink} label='Basic Info' icon={ < Iconify icon='eva:info-outline'/> } iconPosition='start' to='./' style={({ isActive }) => isActive ? setValue('1') : undefined } value='1' />
                <Tab component={NavLink} label="Contacts" icon={ < Iconify icon='eva:person-outline'/> } iconPosition='start' to='./contacts' style={({ isActive }) => isActive ? setValue('2') : undefined } value='2' />
                <Tab component={NavLink} label="Tickets" icon={ < Iconify icon='eva:file-text-outline'/> } iconPosition='start' to='./tickets' style={({ isActive }) => isActive ? setValue('3') : undefined } value='3' />
              </Tabs>
              </Scrollbar>
          </Card>
          </div>
          </Zoom>
        }

            <Zoom in timeout={{appear: 500, enter: 1000}}>
            <div>

            <Outlet context={CURRENT_CUSTOMER} />



            </div>
            </Zoom>
        

    </>
  );
}





