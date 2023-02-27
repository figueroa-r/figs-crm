import { Outlet, useLoaderData } from "react-router-dom";

// @mui
import {
    Container,
    Grid,
} from '@mui/material';


// components
import CustomersBreadcrumb from "../../components/customers-breadcrumb";




// ----------------------------------------------------------------------
export default function CustomersLayout() {

  const customersList = useLoaderData();

  console.log(customersList);



    return (
      <Container>


        <CustomersBreadcrumb />

        <Grid container >
        {/** Child Element */}
        <Grid item xs={12}>
        <Outlet />
        </Grid>
        {/** Child Element */}
        </Grid>
      </Container>
    );
}