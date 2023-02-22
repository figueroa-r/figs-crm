import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

import { useLoaderData } from 'react-router-dom';

// @mui
import {
    Avatar,
    Button,
    Card,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch, 
    TextField, 
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';


// components
import Label from '../../components/label';
import Iconify from '../../components/iconify'


// ----------------------------------------------------------------------

// here we define an object for our controlled input on new customer-contact

const emptyCustomerContact = {
    id: '',
    firstName: '',
    lastName: '',
    title: '',
    department: '',
    active: true,
    avatarId: '',
    contacts: []
}

const emptyContact = {
    id: '',
    method: '',
    methodDetails: ''
}

// ----------------------------------------------------------------------

const StyledContactDetails = styled(Box)(({ theme }) => ({
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

const StyledContactMethods = styled(Box)({
    display: 'grid',
    rowGap: 24,
    marginTop: 24
})



// ----------------------------------------------------------------------

const contactInputs = [
    {id: 'firstName', label: 'First Name'},
    {id: 'lastName', label: 'Last Name'},
    {id: 'title', label: 'Title'},
    {id: 'department', label: 'Department'},
]


// there should be 2 versions of this same layout... one for edit and one for new
// we flag this by passing a boolean in as props to indicate where we have our controlled input

CustomerContactForm.propTypes = {
    edit: PropTypes.bool
}


export default function CustomerContactForm( { edit } ) {

    // here we destrcture either our input or empty customerContact
    // so that we can have a flat state that controls our inputs...
    
    let {contacts, ...customerContact} = useLoaderData();

    if(!edit){
        ({ contacts, ...customerContact } = emptyCustomerContact);
    }

    const [controlledContact, setControlledContact] = useState(customerContact);
    const [controlledContactsList, setControlledContactsList] = useState(contacts);
    // this placeholder allows us to assign a unique id, that will not be saved in the database,
    // since our spring entities have a positive id that gets generated on save
    const [temporaryId, setTemporaryId] = useState(-1);

    

    // handlers

    const handleChangeCustomerContact = (e) => {
        let newValue = e.target.value;
        if(e.target.id === 'active') newValue = e.target.checked;

        setControlledContact( {
            ...controlledContact,
            [e.target.id]: newValue
        })
    }

    // this will need to use an array map to find the correct entity to modify...
    const handleChangeContactsList = (e, field, id = null) => {
        let contactDetailId = e.target.id;
        if(id) contactDetailId = id;
        setControlledContactsList(
            controlledContactsList.map(contactObject => {
                if(contactDetailId === contactObject.id) {
                    return {
                        // may not be doing this correctly...
                        ...contactObject,
                        [field]: e.target.value
                    }
                }
                return contactObject;
            })
        )
    }

    const handleOnClickAddContact = () => {
        const tempId = temporaryId.toString();
        setTemporaryId(temporaryId - 1);

        // add a new contact with the temporary id
        setControlledContactsList([
            ...controlledContactsList,
            { ...emptyContact, id: tempId }
        ])
    }

    const handleOnClickDeleteContact = (e) => {
        setControlledContactsList(
            controlledContactsList.filter(contact => contact.id !== e.target.id)
        )
    }


    return (
        <>
            <Helmet>
                {edit ? <title> Contact : edit | Figs-CRM</title> : <title> Contact : New | Figs-CRM</title> }
            </Helmet>

            <Grid container spacing={{ xs: 2 }}>
                <Grid item xs={12} md={4}>
                <Card sx={{ p: '80px 24px 40px' }}>
                    <Label
                    color={controlledContact.active ? 'success' : 'error' }
                    sx={{
                        zIndex: 9,
                        top: 24,
                        right: 24,
                        position: 'absolute',
                        textTransform: 'uppercase',
                    }}
                    >
                    {controlledContact.active ? 'active' : 'inactive'}
                    </Label>
                    <Box mb={5} display='flex' alignItems='center' justifyContent='center'>
                        <Avatar src={`/assets/images/avatars/avatar_${controlledContact.avatarId}.jpg`} sx={{ width: 126, height: 126 }}/>
                    </Box>
                    <FormControlLabel
                        sx={{justifyContent: 'space-between', width: "100%", margin: '0px 0px 24px'}}
                        checked={controlledContact.active}
                        labelPlacement='start'
                        label={
                            <Typography variant='body1' component='span' >
                            <Typography variant='subtitle2' gutterBottom>Active</Typography>
                            </Typography>}
                        control={
                            <Switch 
                                color={ controlledContact.active ? 'success' : 'error'} 
                                size='medium'
                                id='active'
                                onChange={handleChangeCustomerContact}
                                />}
                    />

                </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                        <Card sx={{ p: 2 }}>
                            <StyledContactDetails>
                                {contactInputs.map((field) => {
                                    const { id, label } = field;

                                    return (
                                        <TextField
                                            fullWidth
                                            key={id}
                                            id={id}
                                            label={label}
                                            value={controlledContact[id]}
                                            onChange={handleChangeCustomerContact}
                                        />
                                    )
                                })}
                            </StyledContactDetails>

                            <StyledContactMethods>
                                {
                                    controlledContactsList.map((contact, index) => {
                                        const { id, method, methodDetails } = contact;
                                        console.log(contact)
                                        return (
                                            <React.Fragment key={id}>
                                            
                                            <Stack direction='row' key={`${id}-Stack`} id={id}>
                                                <FormControl size='medium'>
                                                <InputLabel id='contact-method' key={`${id}-Label`}>Method {index + 1}</InputLabel>
                                                <Select
                                                    id={id}
                                                    autoWidth
                                                    label='Method'
                                                    labelId='contact-method'
                                                    value={method}
                                                    onChange={(event) => handleChangeContactsList(event, 'method', id)}
                                                >
                                                    <MenuItem name='' value=""><em>None</em></MenuItem>
                                                    <MenuItem name='test' value={'Phone'}>Phone</MenuItem>
                                                    <MenuItem name='test2' value={'E-Mail'}>E-Mail</MenuItem>
                                                </Select>
                                                </FormControl>
                                                <TextField
                                                    id={id}
                                                    fullWidth
                                                    contactfield='methodDetails'
                                                    label={`${method || 'Contact'} Details`}
                                                    value={methodDetails}
                                                    onChange={(event) => handleChangeContactsList(event, 'methodDetails')}
                                                />
                                                <IconButton onClick={handleOnClickDeleteContact} id={id} size='large'>
                                                    <Iconify icon='eva:trash-2-outline' id={id}/>
                                                </IconButton>
                                            </Stack>
                                            </React.Fragment>
                                        )
                                    })
                                }

                                <Button onClick={handleOnClickAddContact} variant='outlined' startIcon={<Iconify icon='eva:plus-circle-outline' />}>
                                    Add Contact Method
                                </Button>
                            </StyledContactMethods>

                        </Card>
                    </Grid>


            </Grid>

        </>
    )


}