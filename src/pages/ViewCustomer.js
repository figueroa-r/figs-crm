import { useOutletContext } from "react-router-dom";

import { Helmet } from 'react-helmet-async';
// @mui
import {
    Grid, Typography
} from '@mui/material';

// components
import Iconify from '../components/iconify'
import { AvatarCard, FieldsCard } from '../components/card-containers';




export default function ViewCustomer() {

    const {customerData: { isActive, isVerified, name, alias, companyType, avatarUrl, address1, address2, city, state, zip }} = useOutletContext();
    // console.log(customerData.data);

    const customerStatus = isActive ? 'ACTIVE' : 'INACTIVE';
    const statusColor = isActive ? 'success' : 'error';

    return (
        <>
            <Helmet>
                <title> Customers Details | Figs-CRM </title>
            </Helmet>

            <Grid container spacing={{ xs: 2 }}>
                <AvatarCard
                    labelColor={statusColor}
                    labelText={customerStatus}
                    avatar={avatarUrl}
                    name={name}
                    >
                    <Typography variant='body1' textAlign='center'>
                    {isVerified ? 'Verified ' : 'Pending Verification '}
                    {
                        isVerified ? <Iconify icon='eva:checkmark-circle-fill' sx={{ color: 'success.dark', display: 'inline-block', verticalAlign: 'text-bottom'}} /> 
                        : <Iconify icon='eva:clock-outline' sx={{ color: 'warning.main', display: 'inline-block', verticalAlign: 'text-bottom'}} />
                    }
                    </Typography>
                </AvatarCard>

                <FieldsCard>
                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Name
                        </Typography>
                        <Typography variant='h4'>
                            {name}
                        </Typography>
                        {
                        alias && <Typography variant='h6' gutterBottom>
                            {alias}
                        </Typography>}
                    </Grid>
                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Address
                        </Typography>
                        <Typography variant='h6'>
                            {address1}
                        </Typography>
                        <Typography variant='h6'>
                            {address2}
                        </Typography>
                        <Typography variant='h6' gutterBottom>
                            {`${city}, ${state} ${zip}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Company Type
                        </Typography>
                        <Typography variant='h6' gutterBottom>
                            {companyType}
                        </Typography>
                    </Grid>
                </FieldsCard>
            </Grid>

        </>
    )
    
}