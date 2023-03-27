import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Divider, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { AvatarCard, FieldsCard } from '../components/card-containers';
// section
import { ContactAvatarDialog } from '../sections/dialogs';
import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

const emptyContact = { 
    active: true, 
    avatarId: NaN, 
    firstName: '', 
    lastName: '', 
    title: '', 
    department: ''
}

const emptyContactMethod = {
    id: NaN,
    contactType: 'Phone',
    contactDetail: ''
}

EditContactForm.propTypes = {
    isNew: PropTypes.bool
}

export default function EditContactForm({ isNew = false }) {

    const existingContact = useLoaderData();

    let contactData = emptyContact;
    let contactMethodsArray = [];

    if(!isNew) {
        ({contactsList: contactMethodsArray, ...contactData} = existingContact?.data)
    }


    const [contactInput, setContactInput] = useState( { ...contactData } ) // controlled input for contact entity
    const [contactMethodsInput, setContactMethodsInput] = useState( [...contactMethodsArray] )
    const [loading, setLoading] = useState(false); // loading indicator for fetch/submit
    const [openAvatarSelect, setOpenAvatarSelect] = useState(false); // dialog modal state
    const [nextContactMethodId, setNextContactMethodId] = useState(-1); // placeholder for id of new contact methods (post vs put)


    const title = isNew ? 'New Contact' : 'Edit Contact';
    const contactStatus = contactInput.active ? 'ACTIVE' : 'INACTIVE';
    const statusColor = contactInput.active ? 'success' : 'error';
    const avatarUrl = `/assets/images/avatars/avatar_${contactInput.avatarId}.jpg`;
    const contactName = (`${contactInput.firstName} ${contactInput.lastName}`).trim()

    // dialog handler
    const handleCloseDialog = (selectedValue) => {
        setOpenAvatarSelect(false);
        setContactInput({...contactInput, avatarId: selectedValue});
    }

    // controlled form input
    const handleChangeContactInput = (event) => {
        const property = event.target.id;
        const newValue = (property === 'active') ? event.target.checked : event.target.value;

        setContactInput({...contactInput, [property]: newValue })
    }

    // handlers for contact methods
    const handleAddNewContactMethod = () => {
        const newContactMethod = {...emptyContactMethod, id: nextContactMethodId};

        setContactMethodsInput([...contactMethodsInput, newContactMethod])
        setNextContactMethodId(nextContactMethodId + 1);
    }

    // this method should change to include material-ui-confirm...
    const handleDeleteContactMethod = (event) => {
        const deleteMethodId = parseInt(event.target.id, 10);
        const newMethodsList = contactMethodsInput.filter( method => method.id !== deleteMethodId)

        setContactInput(newMethodsList);
    }

    // handler for controlled input of method
    const handleChangeContactMethod = (event, index, propertyToChange ) => {

        const updatedInputs = [...contactMethodsInput];

        updatedInputs[index][propertyToChange] = event.target.value;
        setContactMethodsInput(updatedInputs);
    }



    const handleSaveContact = (event) => {
        event.preventDefault();
        setLoading(true);
    }

    // boolean comparing controlled input to starting values
    const isButtonActive = isNew ? (
        contactInput.active !== emptyContact.active ||
        contactInput.avatarId !== emptyContact.avatarId ||
        contactInput.firstName !== emptyContact.firstName ||
        contactInput.lastName !== emptyContact.lastName ||
        contactInput.title !== emptyContact.title ||
        contactInput.department !== emptyContact.department ||
        contactInput.contactsList !== emptyContact.contactsList 
    ) : (
        contactInput.active !== contactData.active ||
        contactInput.avatarId !== contactData.avatarId ||
        contactInput.firstName !== contactData.firstName ||
        contactInput.lastName !== contactData.lastName ||
        contactInput.title !== contactData.title ||
        contactInput.department !== contactData.department ||
        contactInput.contactsList !== contactData.contactsList 
    )

    return (
        <form>
            <Helmet>
                <title> {`${title} | Figs-CRM`} </title>
            </Helmet>

            <Grid container spacing={{ xs: 2 }}>
            <AvatarCard
                labelColor={statusColor}
                labelText={contactStatus}
                avatar={avatarUrl}
                name={contactName}
                changeHeight={false}
            >
            {/* Create Button for dialog of avatars */}

                <Button variant='contained' onClick={() => setOpenAvatarSelect(true)}>
                    Change Avatar
                </Button>


                <FormControlLabel
                    checked={contactInput.active}
                    control={<Switch color={statusColor} id='active' onChange={handleChangeContactInput}/>}
                    sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left', mt: 2, ml: 0 }}
                    labelPlacement='start'
                    label={
                        <Stack direction='column'>
                        <Typography variant='overline'>Status</Typography>
                        <Typography variant='subtitle2'>Is the contact active?</Typography>
                        </Stack>
                    }
                />
            </AvatarCard>

            <FieldsCard>
                <Grid item xs={12} md={6}>
                    <TextField
                        name='firstName'
                        required
                        fullWidth
                        id='firstName'
                        label='First Name'
                        value={contactInput.firstName}
                        onChange={handleChangeContactInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        name='lastName'
                        required
                        fullWidth
                        id='lastName'
                        label='Last Name'
                        value={contactInput.lastName}
                        onChange={handleChangeContactInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        name='title'
                        required
                        fullWidth
                        id='title'
                        label='Job Title'
                        value={contactInput.title}
                        onChange={handleChangeContactInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        name='department'
                        required
                        fullWidth
                        id='department'
                        label='Department'
                        value={contactInput.department}
                        onChange={handleChangeContactInput}
                    />
                </Grid>

                {
                    contactMethodsInput.map((contactMethod, index) => {
                        const { id, contactType, contactDetail } = contactMethod;

                        return (
                            <Grid item container xs={12} key={id}>
                                <FormControl sx={{ minWidth: 100, mr: 2, mb:2 }}>
                                    <InputLabel id='method-type'>Type</InputLabel>
                                    <Select
                                        labelId='method-type'
                                        id='contactType'
                                        value={contactType}
                                        onChange={(event) => handleChangeContactMethod(event, index, 'contactType')}
                                    >
                                        <MenuItem value='Phone'>Phone</MenuItem>
                                        <MenuItem value='Email'>Email</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    name={`contactDetail-${id}`}
                                    id='contactDetail'
                                    label='Details'
                                    value={contactDetail}
                                    onChange={(event) => handleChangeContactMethod(event, index, 'contactDetail')}
                                    sx={{ flexGrow: 1}}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <Iconify icon={ contactType === 'Email' ? 'eva:email-outline' : 'eva:phone-outline' } />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        )
                    })
                }

                <Grid item xs={12} flexGrow={1} sx={{ textAlign: 'center' }}>
                    <Button variant='outlined' startIcon={<Iconify icon='eva:plus-circle-outline' />} onClick={handleAddNewContactMethod}>Add Contact Method</Button>
                    <Divider sx={{ mt: 2 }} />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: 'end' }}>
                    <LoadingButton
                        disabled={!isButtonActive}
                        loading={loading}
                        variant='contained'
                        onClick={handleSaveContact}
                        type='submit'
                    >
                        {isNew ? <span>Create Contact</span> : <span>Update Contact</span>}
                    </LoadingButton>
                </Grid>
            </FieldsCard>
            </Grid>

            <ContactAvatarDialog open={openAvatarSelect} onClose={handleCloseDialog} currentAvatarId={contactInput.avatarId} />


        </form>
    )

}