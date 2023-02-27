import { useEffect, useState } from 'react';
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

  const currentMatches = useMatches();
  const tabsNavigator = currentMatches[currentMatches.length - 1].id.indexOf('tabs') !== -1;

  const [value, setValue] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  }

  // work around for error found on https://github.com/mui/material-ui/issues/32749
  useEffect(() => {
    setTimeout(() => {
      setValue(0);
    }, 0)
  }, []);





  return (
    <>
      <Helmet>
        <title> Customers: {CURRENT_CUSTOMER.name} | Figs-CRM </title>
      </Helmet>

        {
          tabsNavigator && <Zoom in timeout={{enter: 500}}><div>
          <Card sx={{p: 2, mb: 2}}>
              <Scrollbar>
              <Tabs value={value} onChange={handleChangeTab}>
                <Tab component={NavLink} label='Basic Info' icon={ < Iconify icon='eva:info-outline'/> } iconPosition='start' to='./' />
                <Tab component={NavLink} label="Contacts" icon={ < Iconify icon='eva:person-outline'/> } iconPosition='start' to='./contacts' />
                <Tab component={NavLink} label="Tickets" icon={ < Iconify icon='eva:file-text-outline'/> } iconPosition='start' to='./tickets' />
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


// <NavLink to='./'>{({ isActive }) => isActive ? setValue('1') : ''}</NavLink>




