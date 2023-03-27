import { Outlet } from "react-router-dom";
import { faker } from '@faker-js/faker';

// @mui
import {
    Container,
    Grid,
} from '@mui/material';


// components
import CustomersBreadcrumb from "../../components/customers-breadcrumb";

const emptyCustomer = {
  avatarUrl: faker.image.business(128, 128, true),
  name: '',
  alias: '',
  companyType: '',
  isActive: true,
  isVerified: false,
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: ''
}




// ----------------------------------------------------------------------
export default function CustomersLayout() {
  
    return (
      <Container>


        <CustomersBreadcrumb />

        <Grid container >
        {/** Child Element */}
        <Grid item xs={12}>
        <Outlet context={{customerData: emptyCustomer}}/>
        </Grid>
        {/** Child Element */}
        </Grid>
      </Container>
    );
}