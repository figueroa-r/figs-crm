import PropTypes from 'prop-types';
// hooks
import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import { useSnackbar } from 'notistack';
// @mui
import { FormControlLabel, Grid, Stack, Switch, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { AvatarCard, FieldsCard } from '../components/card-containers';
// API
import { figsCrmAPI } from '../service/FigsCRMBackend';


EditCustomerForm.propTypes = {
    isNew: PropTypes.bool
}


export default function EditCustomerForm({ isNew = false }) {
    
    const { customerData } = useOutletContext();
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();


    const [customerInput, setCustomerInput] = useState({...customerData});
    const [loading, setLoading] = useState(false);

    const title = isNew ? 'New Customer' : 'Edit Customer';
    const customerStatus = customerInput.isActive ? 'ACTIVE' : 'INACTIVE';
    const statusColor = customerInput.isActive ? 'success' : 'error';
    const verificationColor = customerInput.isVerified ? 'success' : 'warning'

    const handleChangeCustomerInput = (event) => {
        const property = event.target.id;
        const newValue = (property === 'isActive' || property === 'isVerified') ? event.target.checked : event.target.value;

        setCustomerInput({...customerInput, [property]: newValue})
    }

    const handleSaveCustomer = async (event) => {
        event.preventDefault();
        setLoading(true);

        if(isNew) {
            // create new customer 
            try {
                const response = await figsCrmAPI.createCustomer(customerInput);
                setLoading(false);
                const newCustomerName = response.data.name;
                const newCustomerId = response.data.id;
                enqueueSnackbar(`Successfully created New Customer: ${newCustomerName}`, {variant: 'success'});
                navigate(`../${newCustomerId}`);

            } catch (error) {
                console.log(error);
                setLoading(false);
                enqueueSnackbar('Error: try again or contact developer', {variant: 'error'});
            }

        } else { // when customer is being updated
            const propertiesToCheck = [
                'avatarUrl',
                'name',
                'alias',
                'companyType',
                'isActive',
                'isVerified',
                'address1',
                'address2',
                'city',
                'state',
                'zip'
            ]
            const newValues = {};

            propertiesToCheck.forEach(prop => {
                if(customerData[prop] !== customerInput[prop]) newValues[prop] = customerInput[prop];
            })

            // update customer
            try {
                const response = await figsCrmAPI.updateCustomerById(customerData.id, newValues);
                const updatedName = response.data.name;
                setLoading(false);
                enqueueSnackbar(`Successfully updated customer: ${updatedName}`, {variant: 'info'})
                navigate('../..')
            } catch (error) {
                console.log(error);
                setLoading(false);
                enqueueSnackbar('Error: try again or contact developer', {variant: 'error'});
            }

        }
        
    }

    const isButtonDisabled = (
        customerData.name !== customerInput.name ||
        customerData.avatarUrl !== customerInput.avatarUrl ||
        customerData.alias !== customerInput.alias ||
        customerData.companyType !== customerInput.companyType ||
        customerData.isActive !== customerInput.isActive ||
        customerData.isVerified !== customerInput.isVerified ||
        customerData.address1 !== customerInput.address1 ||
        customerData.address2 !== customerInput.address2 ||
        customerData.city !== customerInput.city ||
        customerData.state !== customerInput.state ||
        customerData.zip !== customerInput.zip
    )


    return (
        <form>
            <Helmet>
                <title> {`${title} | Figs-CRM`} </title>
            </Helmet>

            <Grid container spacing={{ xs: 2 }}>
                <AvatarCard
                    labelColor={statusColor}
                    labelText={customerStatus}
                    avatar={customerData.avatarUrl}
                    name={customerData.name}
                >
                    <TextField
                        name='avatarUrl'
                        fullWidth
                        disabled
                        id='avatarUrl'
                        label='Avatar Link'
                        value={customerInput.avatarUrl}
                        onChange={handleChangeCustomerInput}
                    />


                    <FormControlLabel
                        checked={customerInput.isActive}
                        control={<Switch color={statusColor} id='isActive' onChange={handleChangeCustomerInput}/>}
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
                        checked={customerInput.isVerified}
                        control={<Switch color={verificationColor} id='isVerified' onChange={handleChangeCustomerInput}/>}
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
                            value={customerInput.name}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='alias'
                            fullWidth
                            id='alias'
                            label='Customer Alias'
                            value={customerInput.alias || ''}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name='address1'
                            fullWidth
                            id='address1'
                            label='Customer Address Line 1'
                            value={customerInput.address1}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name='address2'
                            fullWidth
                            id='address2'
                            label='Customer Address Line 2'
                            value={customerInput.address2}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='city'
                            fullWidth
                            id='city'
                            label='City'
                            value={customerInput.city}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='state'
                            fullWidth
                            id='state'
                            label='State'
                            value={customerInput.state}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='zip'
                            fullWidth
                            id='zip'
                            label='Zip'
                            value={customerInput.zip}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name='companyType'
                            fullWidth
                            id='companyType'
                            label='Company Type'
                            value={customerInput.companyType}
                            onChange={handleChangeCustomerInput}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'end' }}>
                        <LoadingButton
                            disabled={!isButtonDisabled}
                            loading={loading}
                            variant='contained'
                            onClick={handleSaveCustomer}
                            type='submit'
                        >
                            {isNew ? <span>Create Customer</span> : <span>Update Customer</span>}
                        </LoadingButton>
                    </Grid>
                </FieldsCard>

            </Grid>
        </form>
    )

}