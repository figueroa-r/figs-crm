// react
import { useState } from "react";

import { Link as RouterLink, Outlet, useLoaderData, useMatches } from 'react-router-dom';

// @mui
import { Card, Tab, Tabs } from "@mui/material";

// components
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';

// API
// import { figsCrmAPI } from "../service/FigsCRMBackend";


export default function SingleCustomerLayout() {

    const initialCustomerData = useLoaderData();

    const matches = useMatches(); // matches array, we only need the last one
    const currentTab = matches.pop().id;

    // eslint-disable-next-line
    const [customerData, setCustomerData] = useState(initialCustomerData);
    
    return (
        <>
            {
                currentTab.indexOf('tabs') !== -1 &&
                <Card sx={{ p: 2, mb: 2 }}>
                    <Scrollbar>
                        <Tabs value={currentTab} >
                            <Tab value='tabs1' component={RouterLink} label='Profile' icon={<Iconify icon='eva:info-outline'/>} iconPosition='start' to='.' />
                            <Tab value='tabs2' component={RouterLink} label='Contacts' icon={<Iconify icon='eva:person-outline'/>} iconPosition='start' to='./contacts' />
                            <Tab value='tabs3' component={RouterLink} label='Tickets' icon={<Iconify icon='eva:file-text-outline'/>} iconPosition='start' to='./tickets' />
                        </Tabs>
                    </Scrollbar>
                </Card>
            }


            <Outlet context={{customerData: customerData.data}}/>
        </>
    )
}