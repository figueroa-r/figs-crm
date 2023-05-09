import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
// hooks
import { useFormik, getIn } from 'formik';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Divider, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
// utils
import { formatErrorSnackbar } from '../utils/formatErrorMessage';
// validation
import { contactValidationSchema } from '../validationSchemas/ContactSchema';
// components
import { AvatarCard, FieldsCard } from '../components/card-containers';
// section
import Iconify from '../components/iconify';
import { ContactAvatarDialog } from '../sections/dialogs';
// API
import { createContact, deleteContactDetail, updateContact } from '../service/API-v2/ContactsService';


// ----------------------------------------------------------------------

const emptyContact = { 
    isActive: true, 
    avatarId: 1, 
    firstName: '', 
    lastName: '', 
    title: '', 
    department: '',
    contactsList: []
}

const emptyContactMethod = {
    id: NaN,
    contactType: 'Phone',
    contactDetail: ''
}

// ----------------------------------------------------------------------

EditContactForm.propTypes = {
    isNew: PropTypes.bool
}

export default function EditContactForm({ isNew = false }) {

    const existingContact = useLoaderData();
    const { customerData: { id: customerId } } = useOutletContext();
    const { enqueueSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const navigate = useNavigate();

    const [openAvatarSelect, setOpenAvatarSelect] = useState(false); // dialog modal state
    const [nextContactMethodId, setNextContactMethodId] = useState(-1); // placeholder for id of new contact methods (post vs put)

    // dialog handler
    const handleCloseDialog = (selectedValue) => {
        setOpenAvatarSelect(false);
        contact.setFieldValue('avatarId', selectedValue);
        // setContactInput({...contactInput, avatarId: selectedValue});
    }

    // handlers for adding contact methods
    const handleAddNewContactMethod = () => {
        const newContactMethod = {...emptyContactMethod, id: nextContactMethodId};
        contact.setFieldValue('contactsList', [...contact.values.contactsList, newContactMethod])
        setNextContactMethodId(nextContactMethodId - 1);
    }

    const handleDeleteContactMethod = (id) => () => {

        console.log(id)

        if(id > 0) {
            confirm({
                description: "This action cannot be undone. Please confirm delete of contact detail from database.",
                cancellationButtonProps: { variant: 'outlined' },
                confirmationButtonProps: { variant: 'contained', color: 'error' },
                confirmationText: (
                    <>
                        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                        {'Ok'}
                    </>
                ),
            }).then( async () => {

                try {
                    await deleteContactDetail(id);
                    // on successful delete, remove from existing array
                    contact.setFieldValue('contactsList', contact.values.contactsList.filter( method => method.id !== id))
                    enqueueSnackbar(`Deleted contact method from ${contactName}`, { variant: 'warning' })
                } catch (error) {
                    
                    enqueueSnackbar( ...formatErrorSnackbar(
                        error,
                        'Error Deleting contact method'
                    ))
                }

            }).catch(
                () => {
                    const message = `Cancelled deleting of method`
                    enqueueSnackbar(message, { variant: 'info', style: {whiteSpace: 'pre-line'} });
                }
            )
        } else {
            // remove from existing array
            contact.setFieldValue('contactsList', contact.values.contactsList.filter( (method) => method.id !== id))
            enqueueSnackbar(`Deleted contact method from ${contactName}`, { variant: 'warning' })
        }
    }

    const handleFormikSubmit = async (values) => {

        try {
            let savedContact

            if(isNew) savedContact = await createContact(values)
            else {

                // filter any elements in contact that have changed
                const propsToUpdate =
                    Object.fromEntries(
                        Object.entries(values).filter(([key, value]) => !isEqual(existingContact.data[key], value) )
                    )

                savedContact = await updateContact(existingContact.data.id, propsToUpdate)
            }

            enqueueSnackbar(
                `Successfully ${isNew ? "created" : "updated"} ${savedContact.data.firstName} ${savedContact.data.lastName}`,
                { variant: 'success' }
            )

            navigate('../')
        } catch (error) {
            
            enqueueSnackbar( ...formatErrorSnackbar(
                error,
                'Error Submitting Form'
            ))
        }
    }

    // formik hook
    const contact = useFormik({
        initialValues: isNew ? { ...emptyContact, customerId } : existingContact.data,
        validationSchema: contactValidationSchema,
        onSubmit: handleFormikSubmit
    })

    const title = isNew ? 'New Contact' : 'Edit Contact';
    const contactStatus = contact.values.isActive ? 'ACTIVE' : 'INACTIVE';
    const statusColor = contact.values.isActive ? 'success' : 'error';
    const avatarUrl = `/assets/images/avatars/avatar_${contact.values.avatarId}.jpg`;
    const contactName = (`${contact.values.firstName} ${contact.values.lastName}`).trim()

    return (
        <form noValidate onSubmit={contact.handleSubmit}>
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
                    checked={contact.values.isActive}
                    control={<Switch color={statusColor} id='isActive' onChange={contact.handleChange}/>}
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
                        value={contact.values.firstName}
                        onChange={contact.handleChange}
                        error={Boolean(contact.errors.firstName && contact.touched.firstName)}
                        helperText={contact.touched.firstName && contact.errors.firstName}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        name='lastName'
                        required
                        fullWidth
                        id='lastName'
                        label='Last Name'
                        value={contact.values.lastName}
                        onChange={contact.handleChange}
                        error={Boolean(contact.errors.lastName && contact.touched.lastName)}
                        helperText={contact.touched.lastName && contact.errors.lastName}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        name='title'
                        required
                        fullWidth
                        id='title'
                        label='Job Title'
                        value={contact.values.title}
                        onChange={contact.handleChange}
                        error={Boolean(contact.errors.title && contact.touched.title)}
                        helperText={contact.touched.title && contact.errors.title}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        name='department'
                        required
                        fullWidth
                        id='department'
                        label='Department'
                        value={contact.values.department}
                        onChange={contact.handleChange}
                        error={Boolean(contact.errors.department && contact.touched.department)}
                        helperText={contact.touched.department && contact.errors.department}
                    />
                </Grid>

                {
                    contact.values.contactsList && contact.values.contactsList.map((contactMethod, index) => {
                        const { id, contactType, contactDetail } = contactMethod;
                        const type = `contactsList[${index}].contactType`
                        const detail = `contactsList[${index}].contactDetail`
                        
                        return (
                            <Grid item container xs={12} key={id}>
                                <IconButton onClick={handleDeleteContactMethod(id)} id={id}>
                                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} id={id}/>
                                </IconButton>
                                <TextField
                                    name={type}
                                    id={type}
                                    label="Type"
                                    select
                                    value={contactType}
                                    onChange={contact.handleChange}
                                    error={Boolean(getIn(contact.touched, type) && getIn(contact.errors, type))}
                                    helperText={getIn(contact.touched, type) && getIn(contact.errors, type)}
                                >
                                    <MenuItem value="Phone">Phone</MenuItem>
                                    <MenuItem value="Email">Email</MenuItem>
                                </TextField>
                                
                                <TextField
                                    name={detail}
                                    id={detail}
                                    label='Details'
                                    value={contactDetail}
                                    onChange={contact.handleChange}
                                    error={Boolean(getIn(contact.touched, detail) && getIn(contact.errors, detail))}
                                    helperText={getIn(contact.touched, detail) && getIn(contact.errors, detail)}
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
                    <Button
                        sx={{ mr: 2 }}
                        variant='outline'
                        onClick={() => navigate('../')}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        disabled={!contact.dirty}
                        loading={contact.isSubmitting}
                        variant='contained'
                        type='submit'
                    >
                        {isNew ? <span>Create Contact</span> : <span>Update Contact</span>}
                    </LoadingButton>
                </Grid>
            </FieldsCard>
            </Grid>

            <ContactAvatarDialog open={openAvatarSelect} onClose={handleCloseDialog} currentAvatarId={contact.values.avatarId} />


        </form>
    )

}