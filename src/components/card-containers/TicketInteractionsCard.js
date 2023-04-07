import PropTypes from 'prop-types';
import { Fragment } from 'react';
// @mui
import { Avatar, Card, Divider, Grid, Stack, Typography } from '@mui/material';
// date
import { DateTime } from 'luxon';



TicketInteractionsCard.propTypes = {
    interactionsArray: PropTypes.array,
    children: PropTypes.node
}

export default function TicketInteractionsCard({ interactionsArray, children }) {
    
    const avatarUrl = '/assets/images/avatars/avatar_default.jpg'


    return (
        <Grid item container xs={12}>
            <Card sx={{ p: 3, flexGrow: 1 }}>
                <Grid container>
                    <Typography variant='h4' mb={2}>
                        Interactions
                    </Typography>

                    <Grid item container xs={12} flexWrap='wrap' justifyContent='flex-end'>
                        {children}
                    </Grid>


                    <Divider variant='fullWidth' flexItem sx={{ flexBasis: '100%' }}/>
                    {
                        interactionsArray.map(({id, user, interactionDate, interactionDetails}, index) => {
                            
                            const date = DateTime.fromISO(interactionDate).toLocaleString(DateTime.DATE_SHORT)

                            return (
                                <Fragment key={id}>
                                <Grid item container xs={12} flexWrap='nowrap' key={id} data-index={index} sx={{ mt: 2 }}>
                                    <Avatar
                                        src={avatarUrl}
                                        sizes='48px 48px'
                                        sx={{ mr: '16px' }}
                                    />
                                    <Stack >
                                        <Typography variant='overline'>{user}</Typography>
                                        <Typography variant='caption'  gutterBottom>{date}</Typography>
                                        <Typography variant='body2' gutterBottom>{interactionDetails}</Typography>
                                    </Stack>
                                    
                                </Grid>
                                <br/>
                                { index !== interactionsArray.length - 1 && <Divider flexItem sx={{ flexBasis: '100%' }}/>}
                                </Fragment>
                                
                            )
                        })
                    }
                </Grid>
            </Card>
        </Grid>
    )
}