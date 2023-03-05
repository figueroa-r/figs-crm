// react
import { useState } from 'react';
// react-router
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Card,
    TextField
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/system';


// ----------------------------------------------------------------------


// here, we have the different form inputs as well as their types...

const CUSTOMER_INPUTS = [
    {id: 'name', label: 'Customer Name', inputType: '', isRequired: true, validation: ''},
    {id: 'alias', label: 'Alias', inputType: '', isRequired: false, validation: ''},
    {id: 'address1', label: 'Address Line 1', inputType: '', isRequired: true, validation: ''},
    {id: 'address2', label: 'Address Line 2', inputType: '', isRequired: false, validation: ''},
    {id: 'city', label: 'City', inputType: '', isRequired: true, validation: ''},
    {id: 'state', label: 'State', inputType: '', isRequired: true, validation: ''},
    {id: 'zip', label: 'Zip', inputType: '', isRequired: true, validation: ''},
]


// ----------------------------------------------------------------------

// custom box for our form grid ... utilizes sizing breakpoints to create
// columns based off viewsize

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'grid',
    rowGap: 24,
    columnGap: 16,
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, 1fr)'
    },
    [theme.breakpoints.only('xs')]: {
        gridTemplateColumns: 'repeat(1, 1fr)'
    }
}))

const StyledTextField = styled(TextField)(() => ({
    '.MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: alpha('rgb(0,0,0)', .7)
    }
}))

// ----------------------------------------------------------------------

// here, we define an empty customer for our default controlled component
// in our customer form....
const emptyCustomer = {
    id: null,
    avatarUrl: '',
    name: '',
    alias: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    isVerified: false,
    isActive: true,
    companyType: ''
}

// ----------------------------------------------------------------------

CustomerForm.propTypes = {
    customer: PropTypes.object,
    edit: PropTypes.bool,
    handleCancel: PropTypes.func
}

// ----------------------------------------------------------------------

export default function CustomerForm( { 
    customer = emptyCustomer, 
    edit = true,
    handleCancel } ) {

    // here we can define our state properties with useState hook from react...

    const [customerForm, setCustomerForm] = useState( customer );

    // here we define our handler functions...

    const handleChangeCustomerForm = (event) => {
        setCustomerForm( {
            ...customerForm,
            [event.target.id] : event.target.value
        } )
    }

    const handleCancelClick = () => {
        if(customerForm.id) setCustomerForm( customer );
        handleCancel();
    }

    return (
        <Card sx={{p: 2}}>
            <StyledBox >
                {CUSTOMER_INPUTS.map((fieldProps) => {
                    // eslint-disable-next-line
                    const {id, label, inputType, isRequired, validation} = fieldProps;

                    return (
                        <StyledTextField
                            key={id}
                            id={id}
                            label={label}
                            fullWidth
                            value={customerForm[id] || ''}
                            onChange={handleChangeCustomerForm}
                            // error={validation}
                            disabled={edit === false}
                            required={isRequired}
                            type={inputType}
                            />
                    )
                })}
            </StyledBox>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    mt: 3
                    }}
                >
                {
                    customer !== emptyCustomer ?
                    <LoadingButton
                        size='medium'
                        color='error'
                        variant='contained'
                        onClick={handleCancelClick}
                        >Cancel
                    </LoadingButton> :

                    <LoadingButton
                        component={RouterLink}
                        to='../'
                        size='medium'
                        color='error'
                        variant='contained'
                        >Cancel
                    </LoadingButton>
                }


                {
                    edit === true &&
                    <LoadingButton
                        size='medium'
                        disabled={ customerForm === customer }
                        type='submit'
                        variant='contained'
                        // onCLick={handleClickFunction}
                        >
                        Create Customer
                    </LoadingButton>}
            </Box>
        </Card>
    )

}