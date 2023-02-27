import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

import { useLoaderData, useOutletContext } from 'react-router-dom';

// luxon
import { DateTime } from 'luxon';

// @mui
import {
    Avatar,
    Button,
    Card,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Select,
    Switch, 
    TextField, 
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

// components
import Label from '../../components/label';
// import Iconify from '../../components/iconify'


// ----------------------------------------------------------------------

// here we define an object for our controlled input on new customer-ticket

const emptyCustomerTicket = {
    id: '',
    creationDate: DateTime.now().toJSDate(),
    createdBy: 'Guest User',
    ticketNotes: '',
    isOpen: true,
    categoryId: '',
    priorityId: '',
    primaryContactId: '',
    interactions: []
}

const emptyInteraction = {
    id: '',
    dateTime: DateTime.now().toJSDate(),
    details: '',
    user: 'Guest User'
}

// ----------------------------------------------------------------------

const StyledTicketDetails = styled(Box)(({ theme }) => ({
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

const StyledTicketNotes = styled(Box)({
    rowGap: 24,
    marginTop: 24
})



// ----------------------------------------------------------------------


// there should be 2 versions of this same layout... one for edit and one for new
// we flag this by passing a boolean in as props to indicate where we have our controlled input

CustomerTicketForm.propTypes = {
    isNewTicket: PropTypes.bool
}


export default function CustomerTicketForm( { isNewTicket } ) {

    // here we destrcture either our input or empty customerContact
    // so that we can have a flat state that controls our inputs...
    let {interactions, ...customerTicket} = useLoaderData();

    if(isNewTicket){
        ({ interactions, ...customerTicket } = emptyCustomerTicket);
    }

    // we also have context from our parent element which gives us the contactsDTO list,
    // as well as the categoryMaps and the priorityMaps

    const { contacts, categoryMap, priorityMap } = useOutletContext();

    const [controlledTicket, setControlledTicket] = useState(customerTicket);
    const [controlledInteractionsList, setControlledInteractionsList] = useState(interactions);
    const [newInteraction, setNewInteraction] = useState(emptyInteraction);
    // this placeholder allows us to assign a unique id, that will not be saved in the database,
    // since our spring entities have a positive id that gets generated on save
    const [temporaryId, setTemporaryId] = useState(-1);

    

    // handlers

    const handleChangeTicketDate = (newDate) => {
        setControlledTicket({
            ...controlledTicket,
            creationDate: newDate
        })
    }

    const handleChangeTicketFields = (e) => {
        let newValue = e.target.value;
        if(e.target.id === 'isOpen') newValue = e.target.checked;

        setControlledTicket( {
            ...controlledTicket,
            [e.target.id]: newValue
        })
    }

    const handleTicketSelectField = (e, target) => {
        setControlledTicket( {
            ...controlledTicket,
            [target]: e.target.value
        })
    }

    const handleSetNewInteractionDate = (newDate) => {
        setNewInteraction({
            ...newInteraction,
            dateTime: newDate.toJSDate()
        })
    }
    const handleSetNewInteraction = (e) => {
        setNewInteraction({
            ...newInteraction,
            [e.target.id]: e.target.value
        })
    }

    const handleAddNewInteraction = () => {
        // assign temporary Id to interaction
        setNewInteraction({
            ...newInteraction,
            id: temporaryId.toString()
        })

        // decrement temporaryId placeholder
        setTemporaryId(temporaryId - 1);

        // add the most recent interaction to our list
        setControlledInteractionsList([
            ...controlledInteractionsList,
            {
                ...newInteraction
            }
        ])

        // reset the fields in our controlled interaction
        setNewInteraction(emptyInteraction)

    }


    return (
        <>
            <Helmet>
                {isNewTicket ? <title> Ticket : New | Figs-CRM</title> : <title> Ticket : View | Figs-CRM</title> }
            </Helmet>

            {/** This is the smaller of the cards, with the avatar, switches, and label */}
            <Grid container spacing={{ xs: 2 }} alignItems='center'>
                <Grid item xs={12} md={4}>
                <Card sx={{ p: '80px 24px 40px' }}>
                    <Label
                    color={controlledTicket.isOpen ? 'success' : 'error' }
                    sx={{
                        zIndex: 9,
                        top: 24,
                        right: 24,
                        position: 'absolute',
                        textTransform: 'uppercase',
                    }}
                    >
                    {controlledTicket.isOpen ? 'open' : 'closed'}
                    </Label>
                    <Box mb={5} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                        <Avatar 
                            src={`/assets/images/avatars/avatar_${contacts.filter(contact => contact.id === controlledTicket.primaryContactId)[0]?.avatarId}.jpg`} 
                            sx={{ width: 126, height: 126, mb: 2 }}
                        />
                        <FormControl fullWidth>
                            <InputLabel id='primaryContactId-input-label'>Primary Contact</InputLabel>
                            <Select
                                fullWidth
                                id='primaryContactId'
                                label='Primary Contact'
                                labelId='primaryContact-input-label'
                                value={controlledTicket.primaryContactId}
                                onChange={(e) => handleTicketSelectField(e, 'primaryContactId')}
                            >
                                <MenuItem value=''><em>None</em></MenuItem>
                                {
                                    // insert map for our different values... we can use provider context to get this from the database at
                                    // the top level and pass it down to relevant areas...
                                    contacts.map(contact => (
                                        <MenuItem value={contact.id} key={`contact-${contact.id}`}>{contact.name}</MenuItem>
                                    ))
                                    
                                }
                            </Select>
                        </FormControl>
                        {/* <Typography variant='caption'>Assigned point-of-contact</Typography> */}
                    </Box>
                    
                    <FormControlLabel
                        sx={{justifyContent: 'space-between', width: "100%", margin: '0px 0px 24px'}}
                        checked={ controlledTicket.isOpen }
                        labelPlacement='start'
                        label={
                            <Typography variant='body1' component='span' >
                            <Typography variant='subtitle2' gutterBottom>Ticket Status</Typography>
                            </Typography>}
                        control={
                            <Switch 
                                color={ controlledTicket.isOpen ? 'success' : 'error'} 
                                size='medium'
                                id='isOpen'
                                onChange={handleChangeTicketFields}
                                />}
                    />

                </Card>
                </Grid>

                {/** This is the larger of the cards, with the text inputs, category/priority dropdowns and date picker */}
                <Grid item xs={12} md={8}>
                        <Card sx={{ p: 2 }} >
                            <StyledTicketDetails>
                                <DatePicker
                                    disableFuture
                                    label="Ticket Creation"
                                    inputFormat='MM/dd/yyyy'
                                    value={controlledTicket.creationDate}
                                    onChange={handleChangeTicketDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                                <TextField
                                    fullWidth
                                    disabled
                                    id='createdBy'
                                    label='Created By'
                                    value={controlledTicket.createdBy}
                                    onChange={handleChangeTicketFields}
                                />

                                <FormControl>
                                    <InputLabel id='category-input-label'>Category</InputLabel>
                                    <Select
                                        id='category'
                                        MenuProps={{id: 'category'}}
                                        fullWidth
                                        label='Category'
                                        labelId='category-input-label'
                                        value={controlledTicket.categoryId}
                                        onChange={(e) => handleTicketSelectField(e, 'categoryId')}
                                    >
                                        <MenuItem value=''><em>None</em></MenuItem>
                                        {
                                            // insert map for our different values... we can use provider context to get this from the database at
                                            // the top level and pass it down to relevant areas...
                                            Object.entries(categoryMap).map(([id, value]) => (
                                                <MenuItem value={id} key={`category-${id}`}>{value.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <InputLabel id='priority-input-label'>Priority</InputLabel>
                                    <Select
                                        id='priorityId'
                                        fullWidth
                                        MenuProps={{id: 'priority'}}
                                        label='Priority'
                                        labelId='priority-input-label'
                                        value={controlledTicket.priorityId}
                                        onChange={(e) => handleTicketSelectField(e, 'priorityId'    )}
                                    >
                                        <MenuItem value=''><em>None</em></MenuItem>
                                        {
                                            // insert map for our different values... we can use provider context to get this from the database at
                                            // the top level and pass it down to relevant areas...
                                            Object.entries(priorityMap).map(([id, value]) => (
                                                <MenuItem value={id} key={`priority-${id}`}>{value.name}</MenuItem>
                                            ))
                                            
                                        }
                                    </Select>
                                </FormControl>
                            </StyledTicketDetails>
                            <StyledTicketNotes>
                                
                                <TextField
                                    fullWidth
                                    id='ticketNotes'
                                    label='Ticket Notes'
                                    multiline
                                    minRows={3}
                                    value={controlledTicket.ticketNotes}
                                    onChange={handleChangeTicketFields}
                                />
                            </StyledTicketNotes>
                        </Card>
                    </Grid>

                    {
                        !isNewTicket && <Grid item xs={12} md={12}>
                            <Card sx={{ p: 2 }}>
                                <Typography variant='h4'>Interactions</Typography>
                                <DatePicker
                                    disableFuture
                                    id='dateTime'
                                    label="Interaction Date"
                                    inputFormat='MM/dd/yyyy'
                                    value={newInteraction.dateTime}
                                    onChange={handleSetNewInteractionDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <TextField
                                    id='user'
                                    label='User'
                                    value='Guest User'
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    id='details'
                                    label='Interaction Details'
                                    multiline
                                    minRows={4}
                                    value={newInteraction.details}
                                    onChange={handleSetNewInteraction}
                                />
                                <Button onClick={handleAddNewInteraction}>Add New Interaction</Button>

                                <Divider variant='fullWidth' />

                                <List>
                                {
                                    [...Array(controlledInteractionsList.length)].map((_, index) => {
                                        const reverseIndex = controlledInteractionsList.length - index - 1;
                                        const interaction = controlledInteractionsList[reverseIndex];

                                        return (
                                            <React.Fragment key={interaction.id}>
                                            <ListItem key={interaction.id}>
                                                <Avatar 
                                                    src='/assets/images/avatars/avatar_default.jpg'
                                                    sizes='48px 48px'
                                                    sx={{ mr: '16px' }}
                                                />

                                                <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                                                    <Typography variant='subtitle1'>{interaction.user}</Typography>
                                                    <Typography variant='caption'>{DateTime.fromJSDate(interaction.dateTime).toLocaleString(DateTime.DATE_SHORT)}</Typography>
                                                    <Typography variant='body2' mt='8px'>{interaction.details}</Typography>
                                                </Box>
                                                
                                            </ListItem>
                                            <Divider variant='fullWidth' />
                                            </React.Fragment>
                                        )
                                    })
                                }
                                </List>

                            </Card>
                        </Grid>
                    }


            </Grid>

        </>
    )


}