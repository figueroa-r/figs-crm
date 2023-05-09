import PropTypes from 'prop-types';
// hooks
import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
// @mui
import { FormControlLabel, Grid, Stack, Switch, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import { formatErrorSnackbar } from '../utils/formatErrorMessage';
// components
import { AvatarCard, FieldsCard } from '../components/card-containers';
// API
import { createCustomer, updateCustomerById } from '../service/API-v2/CustomersService';
// customer validation
import { customerValidationSchema } from '../validationSchemas/CustomerSchema';




EditCustomerForm.propTypes = {
    isNew: PropTypes.bool
}


export default function EditCustomerForm({ isNew = false }) {
    
    const { customerData } = useOutletContext();
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const customerFormik = useFormik({
        initialValues: { ...customerData },
        validationSchema: customerValidationSchema,
        onSubmit: async (values) => {
            // event.preventDefault();
            setLoading(true);
    
            try {
    
                let response;
                if(isNew) response = await createCustomer(values)
                else {
                    const updatedFields = {};
                    Object.keys(values).forEach((field) => {
                        if(values[field] !== customerFormik.initialValues[field]) updatedFields[field] = values[field]
                    }) 
    
                    response = await updateCustomerById(values.id, updatedFields)
                }
    
                const customerName = response.data.name;
                const message = `Successfully ${isNew ? 'created new' : 'updated'} customer: ${customerName}`
                enqueueSnackbar( message, { variant: 'success', style: { whiteSpace: 'pre-line' }} )
    
                navigate('../..')
                
            } catch (error) {
    
                enqueueSnackbar( ...formatErrorSnackbar(
                    error,
                    'Error Saving Customer'
                ))
                
            } finally {
    
                setLoading(false)
            }
        },
        validateOnBlur: true
    })

    const [loading, setLoading] = useState(false);

    const title = isNew ? 'New Customer' : 'Edit Customer';
    const customerStatus = customerFormik.values.isActive ? 'ACTIVE' : 'INACTIVE';
    const statusColor = customerFormik.values.isActive ? 'success' : 'error';
    const verificationColor = customerFormik.values.isVerified ? 'success' : 'warning'


    return (
        <form onSubmit={customerFormik.handleSubmit} noValidate>
            <Helmet>
                <title> {`${title} | Figs-CRM`} </title>
            </Helmet>

            <Grid container spacing={{ xs: 2 }}>
                <AvatarCard
                    labelColor={statusColor}
                    labelText={customerStatus}
                    avatar={customerFormik.values.avatarUrl}
                    name={customerFormik.values.name}
                >
                    <TextField
                        name='avatarUrl'
                        fullWidth
                        disabled
                        id='avatarUrl'
                        label='Avatar Link'
                        value={customerFormik.values.avatarUrl}
                        onChange={customerFormik.handleChange}
                        error={Boolean(customerFormik.errors.avatarUrl && customerFormik.touched.avatarUrl)}
                        helperText={customerFormik.touched.avatarUrl && customerFormik.errors.avatarUrl}
                    />


                    <FormControlLabel
                        checked={customerFormik.values.isActive}
                        control={<Switch color={statusColor} id='isActive' onChange={customerFormik.handleChange}/>}
                        sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left', mt: 2, ml: 0 }}
                        labelPlacement='start'
                        label={
                            <Stack direction='column'>
                            <Typography variant='overline'>Status</Typography>
                            <Typography variant='subtitle2'>Is the customer active?</Typography>
                            </Stack>
                        }
                    />
                    <FormControlLabel
                        checked={customerFormik.values.isVerified}
                        control={<Switch color={verificationColor} id='isVerified' onChange={customerFormik.handleChange}/>}
                        sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left', mt: 2, ml: 0  }}
                        labelPlacement='start'
                        label={
                            <Stack direction='column'>
                            <Typography variant='overline'>Verification</Typography>
                            <Typography variant='subtitle2'>Has the customer been verified?</Typography>
                            </Stack>
                        }
                    />
                </AvatarCard>


                <FieldsCard>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='name'
                            required
                            fullWidth
                            id='name'
                            label='Customer Name'
                            value={customerFormik.values.name}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.name && Boolean(customerFormik.errors.name)}
                            helperText={customerFormik.touched.name && customerFormik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='alias'
                            fullWidth
                            id='alias'
                            label='Customer Alias'
                            value={customerFormik.values.alias || ''}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.alias && Boolean(customerFormik.errors.alias)}
                            helperText={customerFormik.touched.alias && customerFormik.errors.alias}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name='address1'
                            fullWidth
                            id='address1'
                            label='Customer Address Line 1'
                            value={customerFormik.values.address1}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.address1 && Boolean(customerFormik.errors.address1)}
                            helperText={customerFormik.touched.address1 && customerFormik.errors.address1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name='address2'
                            fullWidth
                            id='address2'
                            label='Customer Address Line 2'
                            value={customerFormik.values.address2 || ''}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.address2 && Boolean(customerFormik.errors.address2)}
                            helperText={customerFormik.touched.address2 && customerFormik.errors.address2}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='city'
                            fullWidth
                            id='city'
                            label='City'
                            value={customerFormik.values.city}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.city && Boolean(customerFormik.errors.city)}
                            helperText={customerFormik.touched.city && customerFormik.errors.city}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='state'
                            fullWidth
                            id='state'
                            label='State'
                            value={customerFormik.values.state}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.state && Boolean(customerFormik.errors.state)}
                            helperText={customerFormik.touched.state && customerFormik.errors.state}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='zip'
                            fullWidth
                            id='zip'
                            label='Zip'
                            value={customerFormik.values.zip}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.zip && Boolean(customerFormik.errors.zip)}
                            helperText={customerFormik.touched.zip && customerFormik.errors.zip}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='companyType'
                            fullWidth
                            id='companyType'
                            label='Company Type'
                            value={customerFormik.values.companyType}
                            onChange={customerFormik.handleChange}
                            error={customerFormik.touched.companyType && Boolean(customerFormik.errors.companyType)}
                            helperText={customerFormik.touched.companyType && customerFormik.errors.companyType}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'end' }}>
                        <LoadingButton
                            loading={loading}
                            variant='contained'
                            type='submit'
                            disabled={!customerFormik.dirty}
                        >
                            {isNew ? <span>Create Customer</span> : <span>Update Customer</span>}
                        </LoadingButton>
                    </Grid>
                </FieldsCard>

            </Grid>
        </form>
    )

}