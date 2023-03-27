import { useState } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';

import { DateTime } from 'luxon';

// @mui
import { Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../components/iconify';
import Label from '../components/label';
import { AvatarCard, FieldsCard, TicketInteractionsCard } from '../components/card-containers';

// API
import { figsCrmAPI } from '../service/FigsCRMBackend';





export default function ViewTicket() {

    const { data: ticketData } = useLoaderData();
    const { id, isOpen, creationDate, primaryContactId, categoryId, priorityId, ticketNotes, interactions } = ticketData;

    const { categoriesMap, prioritiesMap, contactsMap } = useOutletContext();

    const { enqueueSnackbar } = useSnackbar();

    // will need state for controlled interaction input...
    const [newInteraction, setNewInteraction] = useState('');
    const [loadingIndicator, setLoadingIndicator] = useState(false);

    const [interactionsList, setInteractionsList] = useState([...interactions.reverse()]);

    // avatar card values
    const ticketStatus = isOpen ? 'OPEN' : 'CLOSED';
    const statusColor = isOpen ? 'error' : 'default';
    const { fullName, avatarId } = contactsMap.get(primaryContactId);
    const avatarSrc = `/assets/images/avatars/avatar_${avatarId}.jpg`
    const { name: categoryName, variant: categoryVariant } = categoriesMap.get(categoryId);
    const { name: priorityName, variant: priorityVariant } = prioritiesMap.get(priorityId);

    const handleNewInteraction = (event) => {
        setNewInteraction(event.target.value);
    }

    // eslint-disable-next-line
    const handleCreateNewInteraction = async (event) => {

        const interaction = { user: 'Guest User', interactionDate: DateTime.now(), interactionDetails: newInteraction }

        setLoadingIndicator(true);

        try {
            const response = await figsCrmAPI.createInteraction(id, interaction);

            if(!response.ok) {
                throw new Error('There was an error creating the interaction. Try again');
            }

            setNewInteraction('');
            setLoadingIndicator(false);
            setInteractionsList([response.body, ...interactionsList])

            enqueueSnackbar('Successfully created interaction', {variant: 'success'});


        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'warning'})
            setLoadingIndicator(false);
        }
        
    }



    return (
        <>
            <Helmet>
                <title> Ticket Details | Figs-CRM </title>
            </Helmet>

            <Grid container spacing={{ xs : 2 }}>
                <AvatarCard
                    labelColor={statusColor}
                    labelText={ticketStatus}
                    avatar={avatarSrc}
                    name={fullName}
                    ticketPriority={priorityName}
                    priorityVariant={priorityVariant.toLowerCase()}
                >
                    <Typography variant='overline' gutterBottom>
                        Assigned Contact
                    </Typography>
                    <Typography variant='h6'>
                        {fullName}
                    </Typography>                    

                </AvatarCard>

                <FieldsCard >
                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Created
                        </Typography>
                        <Typography variant='subtitle1'>
                            <Iconify icon='material-symbols:calendar-today-rounded' sx={{ display: 'inline-block', verticalAlign: 'text-bottom' }} mr={2} /> {creationDate}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Category
                        </Typography>
                        <Typography variant='h6'>
                            <Label color={categoryVariant.toLowerCase()}>{categoryName}</Label>
                        </Typography>
                    </Grid>

                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Ticket Notes
                        </Typography>
                        <Typography variant='subtitle1'>
                            {ticketNotes}
                        </Typography>
                    </Grid>
                </FieldsCard>

                <TicketInteractionsCard interactionsArray={interactionsList}>
                    <TextField
                        id='newInteractionNotes'
                        label='Create a new interaction...'
                        multiline
                        minRows={4}
                        fullWidth
                        value={newInteraction}
                        onChange={handleNewInteraction}
                    />
                    <LoadingButton 
                        sx={{ my: 2 }} 
                        variant='contained'
                        disabled={newInteraction === ''}
                        loading={loadingIndicator}
                        loadingPosition='start'
                        startIcon={<Iconify icon='eva:plus-outline' />}
                        onClick={handleCreateNewInteraction}
                    >
                        <span>Add New Interaction</span>
                    </LoadingButton>
                </TicketInteractionsCard>

            </Grid>

        </>
    )

    
}