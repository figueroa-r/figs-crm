import { Helmet } from 'react-helmet-async';
// @mui
import {
  Breadcrumbs,
  Container,
  Typography
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
// components
// sections
import { CustomerForm } from '../sections/@dashboard/customer';
// mock


// ----------------------------------------------------------------------


const StyledBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '40px'
}))

const StyledBox2 = styled(Box)(() => ({
  display: 'box',
  flexGrow: 1
}))


// ----------------------------------------------------------------------

export default function CustomerPage() {

  return (
    <>
      <Helmet>
        <title> Customers: Create New Customer | Figs-CRM </title>
      </Helmet>

      <Container>
        <StyledBox>
        <StyledBox2>
          <Typography variant="h4" gutterBottom>
            Create a new customer
          </Typography>
          <Breadcrumbs separator='|'>
            {[
              <Typography variant='body1' key='Figs-CRM'>Figs-CRM</Typography>,
              <Typography variant='body1' key='Customers'>Customers</Typography>,
              <Typography variant='body1' key='New Customer'>New Customer</Typography>
            ]}
          </Breadcrumbs>
        </StyledBox2>
        </StyledBox>
          
        <CustomerForm />
      </Container>

    </>
  );
}
