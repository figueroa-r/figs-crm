import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
// hooks
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLoaderData, useOutletContext, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LoadingButton } from '@mui/lab';
// components
import { AvatarCard, FieldsCard } from '../components/card-containers';
// API
import { figsCrmAPI } from '../service/FigsCRMBackend';



// ----------------------------------------------------------------------

const emptyTicket = {
    creationDate: DateTime.now().toFormat('MM-dd-yyyy'),
    isOpen: true,
    ticketNotes: '',
    priorityId: '',
    categoryId: 1,
    primaryContactId: ''
}




// ----------------------------------------------------------------------

EditTicketForm.propTypes = {
    isNew: PropTypes.bool
}


export default function EditTicketForm({ isNew = false }) {
    
    const existingTicket = useLoaderData();
    const { categoriesMap, prioritiesMap, contactsMap, customerURI } = useOutletContext();

    let ticketData = emptyTicket;
    if(!isNew) {
        ticketData = existingTicket?.data;
    }

    const [ticketInput, setTicketInput] = useState({ ...ticketData }) // controlled input for ticket entity
    const [loading, setLoading] = useState(false) // bool for fetch/submit
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const title = isNew ? 'New Ticket' : 'Edit Ticket';
    // avatar card values
    const ticketStatus = ticketInput.isOpen ? 'OPEN' : 'CLOSED';
    const statusColor = ticketInput.isOpen ? 'error' : 'default';
    const { fullName, avatarId } = contactsMap.get(ticketInput.primaryContactId) || { fullName : '', avatarId: '' };
    const avatarSrc = `/assets/images/avatars/avatar_${avatarId}.jpg`;
    const { name: priorityName, variant: priorityVariant } = prioritiesMap.get(ticketInput.priorityId);


    const handleChangeTicketInput = (event, target) => {
        if(submitDisabled) setSubmitDisabled(false);
        const newValue = target === 'isOpen' ? event.target.checked : event.target.value
        setTicketInput({...ticketInput, [target]: newValue})
    }

    const handleSubmitTicket = async () => {
        setLoading(true);
        const primaryContactURI = contactsMap.get(ticketInput.primaryContactId)?._links.self.href;
        const categoryURI = categoriesMap.get(ticketInput.categoryId)?._links.self.href;
        const priorityURI = prioritiesMap.get(ticketInput.priorityId)?._links.self.href;

        const ticketToSave = {
            isOpen: ticketInput.isOpen,
            ticketNotes: ticketInput.ticketNotes,
            primaryContact: primaryContactURI,
            category: categoryURI,
            priority: priorityURI,
            customer: customerURI
        }

        if(isNew) {
            ticketToSave.creationDate = ticketInput.creationDate.toFormat('yyyy-MM-dd');
            // create new ticket
            try {
                const response = await figsCrmAPI.createTicket(ticketToSave);
                setLoading(false);
                enqueueSnackbar('Successfully created New Ticket!', { variant: 'success' });
                navigate(`../${response.data.id}`)
                
            } catch (error) {
                console.log(error);
                setLoading(false);
                enqueueSnackbar('Error creating new ticket, try again', { variant: 'error' })
            }
        }else {
            // update existing ticket fields...
            try {
                const response = await figsCrmAPI.updateTicket(ticketInput.id, ticketToSave)
                setLoading(false)
                enqueueSnackbar(`Successfully update Ticket#${response.data.id}`, { variant: 'success' });
                navigate(`../${response.data.id}`)
            } catch (error) {
                console.log(error);
                setLoading(false);
                enqueueSnackbar('Error updating ticket, try again', { variant: 'error' });
            }
        }

    }



    return (
        <>
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

                    <FormControl fullWidth sx={{ mb: 2}}>
                        <InputLabel id='contact-select'>Primary Contact</InputLabel>
                        <Select
                            labelId='contact-select'
                            id='primaryContactId'
                            value={ticketInput.primaryContactId}
                            label='Primary Contact'
                            onChange={(e) => handleChangeTicketInput(e, 'primaryContactId')}
                        >
                            <MenuItem value=''>None Selected</MenuItem>
                            {
                                [...contactsMap.keys()].map(contactId => {
                                    const { fullName } = contactsMap.get(contactId)

                                    return (
                                        <MenuItem value={contactId} key={contactId}>{fullName}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>


                    <FormControl fullWidth>
                        <InputLabel id='priority-select'>Priority</InputLabel>
                        <Select
                            labelId='priority-select'
                            id='priorityId'
                            value={ticketInput.priorityId}
                            label='Priority'
                            onChange={(e) => handleChangeTicketInput(e, 'priorityId')}
                        >
                            <MenuItem value=''>None Selected</MenuItem>
                            {
                                [...prioritiesMap.keys()].map(priorityId => {
                                    const { name } = prioritiesMap.get(priorityId)

                                    return (
                                        <MenuItem value={priorityId} key={priorityId}>{name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>


                    <FormControlLabel
                        checked={ticketInput.isOpen}
                        control={<Switch color={statusColor.toLowerCase()} id='isOpen' onChange={(e) => handleChangeTicketInput(e, 'isOpen')}/>}
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
                            value={ticketInput.creationDate}
                            onChange={(newDate) => setTicketInput({...ticketInput, creationDate: newDate})}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id='category-select'>Category</InputLabel>
                            <Select
                                labelId='category-select'
                                id='categoryId'
                                value={ticketInput.categoryId}
                                label='Category'
                                onChange={(e) => handleChangeTicketInput(e, 'categoryId')}
                            >
                                <MenuItem value=''>None Selected</MenuItem>
                                {
                                    [...categoriesMap.keys()].map(categoryId => {
                                        const { name } = categoriesMap.get(categoryId)

                                        return (
                                            <MenuItem value={categoryId} key={categoryId}>{name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id='ticketNotes'
                            label='Ticket Notes'
                            multiline
                            minRows={4}
                            value={ticketInput.ticketNotes}
                            onChange={(e) => handleChangeTicketInput(e, 'ticketNotes')}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: 'end' }}>
                        <LoadingButton
                            disabled={submitDisabled}
                            loading={loading}
                            variant='contained'
                            onClick={handleSubmitTicket}
                        >
                            {isNew ? <span>Create Ticket</span> : <span>Update Ticket</span>}
                        </LoadingButton>
                    </Grid>
                </FieldsCard>
            </Grid>


        </>
    )
    


}