import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
// hooks
import { Helmet } from 'react-helmet-async';
import { useLoaderData, useOutletContext, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
// @mui
import { FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LoadingButton } from '@mui/lab';
// utils
import { formatErrorSnackbar } from '../utils/formatErrorMessage';
// validation
import { ticketValidationSchema } from '../validationSchemas/TicketSchema';
// components
import { AvatarCard, FieldsCard } from '../components/card-containers';
// API
import { createTicket, updateTicketById } from '../service/API-v2/TicketsService';



// ----------------------------------------------------------------------

const emptyTicket = {
    creationDate: DateTime.now(),
    isOpen: true,
    ticketNotes: '',
    priorityId: 1,
    categoryId: 1,
    primaryContactId: ''
}




// ----------------------------------------------------------------------

EditTicketForm.propTypes = {
    isNew: PropTypes.bool
}


export default function EditTicketForm({ isNew = false }) {
    
    const existingTicket = useLoaderData();

    const { categoriesMap, prioritiesMap, contactsMap, customerId } = useOutletContext();

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSubmitTicket = async (values) => {

        values.creationDate = values.creationDate.toFormat('yyyy-MM-dd')

        try {

            let savedTicket

            if(isNew) {
                savedTicket = await createTicket(values)
            } else {
                
                // filter any elements in ticket that have changed
                const propsToUpdate = 
                    Object.fromEntries(
                        Object.entries(values).filter(([key, value]) => (key !== 'creationDate' && !isEqual(existingTicket.data[key], value)) )
                    )
                savedTicket = await updateTicketById(existingTicket.data.id, propsToUpdate)
            }

            enqueueSnackbar(
                `Successfully ${ isNew ? 'created new Ticket!' : `updated Ticket#${savedTicket.data.id}`}`, 
                { variant: 'success' })
            navigate(`../${savedTicket.data.id}`) 

        } catch (error) {
            
            enqueueSnackbar( ...formatErrorSnackbar(
                error,
                'Error Submitting Form'
            ))
        }

    }


    const ticket = useFormik({
        initialValues: isNew ? { ...emptyTicket, customerId } : {
            ...existingTicket.data, 
            creationDate: DateTime.fromFormat(existingTicket.data.creationDate, 'yyyy-MM-dd') },
        validationSchema: ticketValidationSchema,
        onSubmit: handleSubmitTicket
    })


    // calculated values

    const title = isNew ? 'New Ticket' : 'Edit Ticket';
    // avatar card values
    const ticketStatus = ticket.values.isOpen ? 'OPEN' : 'CLOSED';
    const statusColor = ticket.values.isOpen ? 'error' : 'default';
    const { fullName, avatarId } = contactsMap.get(ticket.values.primaryContactId);
    const avatarSrc = `/assets/images/avatars/avatar_${avatarId}.jpg`;
    const { name: priorityName, variant: priorityVariant } = prioritiesMap.get(ticket.values.priorityId);



    return (
        <form noValidate onSubmit={ticket.handleSubmit}>
            <Helmet>
                <title> {`${title} | Figs-CRM`} </title>
            </Helmet>

            <Grid container spacing={{ xs: 2 }}>
                <AvatarCard
                    labelColor={statusColor}
                    labelText={ticketStatus}
                    ticketPriority={priorityName}
                    priorityVariant={priorityVariant.toLowerCase()}
                    avatar={avatarSrc}
                    name={fullName}
                    changeHeight={false}
                >

                    <TextField
                        fullWidth 
                        sx={{ mb: 2}}
                        name='primaryContactId'
                        id='primaryContactId'
                        label='Primary Contact'
                        select
                        value={ticket.values.primaryContactId}
                        onChange={ticket.handleChange}
                        error={Boolean(ticket.touched.primaryContactId && ticket.errors.primaryContactId)}
                        helperText={ticket.touched.primaryContactId && ticket.errors.primaryContactId}
                    >
                        <MenuItem value=''>None Selected</MenuItem>
                            {[...contactsMap.keys()].map(contactId => {
                                    const { fullName } = contactsMap.get(contactId)

                                    return (
                                        <MenuItem value={contactId} key={contactId}>{fullName}</MenuItem>
                                    )
                                })}
                    </TextField>

                    <TextField
                        name='priorityId'
                        id='priorityId'
                        label='Priority'
                        select
                        fullWidth
                        value={ticket.values.priorityId}
                        onChange={ticket.handleChange}
                        error={Boolean(ticket.touched.priorityId && ticket.errors.priorityId)}
                        helperText={ticket.touched.priorityId && ticket.errors.priorityId}
                    >
                        <MenuItem value=''>None Selected</MenuItem>
                            {[...prioritiesMap.keys()].map(priorityId => {
                                    const { name } = prioritiesMap.get(priorityId)

                                    return (
                                        <MenuItem value={priorityId} key={priorityId}>{name}</MenuItem>
                                    )
                                })}
                    </TextField>


                    <FormControlLabel
                        checked={ticket.values.isOpen}
                        control={<Switch color={statusColor.toLowerCase()} id='isOpen' onChange={ticket.handleChange}/>}
                        sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left', mt: 2, ml: 0 }}
                        labelPlacement='start'
                        label={
                            <Stack direction='column'>
                            <Typography variant='overline'>Status</Typography>
                            <Typography variant='subtitle2'>Is the ticket open?</Typography>
                            </Stack>
                        }
                    />
                </AvatarCard>

                <FieldsCard changeHeight={false}>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            disabled={!isNew}
                            fullWidth
                            disableFuture
                            label='Ticket Creation'
                            inputFormat='MM/dd/yyyy'
                            value={ticket.values.creationDate}
                            onChange={(newDate) => ticket.setFieldValue('creationDate', newDate)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            name='categoryId'
                            id='categoryId'
                            label='Category'
                            select
                            fullWidth
                            value={ticket.values.categoryId}
                            onChange={ticket.handleChange}
                            error={Boolean(ticket.touched.categoryId && ticket.errors.categoryId)}
                            helperText={ticket.touched.categoryId && ticket.errors.categoryId}
                        >
                            <MenuItem value=''>None Selected</MenuItem>
                                {[...categoriesMap.keys()].map(categoryId => {
                                        const { name } = categoriesMap.get(categoryId)

                                        return (
                                            <MenuItem value={categoryId} key={categoryId}>{name}</MenuItem>
                                        )
                                    })}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id='ticketNotes'
                            label='Ticket Notes'
                            multiline
                            minRows={4}
                            value={ticket.values.ticketNotes}
                            onChange={ticket.handleChange}
                            error={Boolean(ticket.touched.ticketNotes && ticket.errors.ticketNotes)}
                            helperText={ticket.touched.ticketNotes && ticket.errors.ticketNotes}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: 'end' }}>
                        <LoadingButton
                            disabled={!ticket.dirty}
                            loading={ticket.isSubmitting}
                            variant='contained'
                            type='submit'
                        >
                            {isNew ? <span>Create Ticket</span> : <span>Update Ticket</span>}
                        </LoadingButton>
                    </Grid>
                </FieldsCard>
            </Grid>


        </form>
    )
    


}