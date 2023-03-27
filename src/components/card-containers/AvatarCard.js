import PropTypes from 'prop-types';

import { Avatar, Box, Card, Grid } from "@mui/material";
import Label from '../label';

AvatarCard.propTypes = {
    labelColor: PropTypes.string,
    labelText: PropTypes.string,
    avatar: PropTypes.string,
    name: PropTypes.string,
    ticketPriority: PropTypes.string,
    priorityVariant: PropTypes.string,
    changeHeight: PropTypes.bool,
    children: PropTypes.node
}

export default function AvatarCard({ labelColor, labelText, avatar, name, ticketPriority, priorityVariant, changeHeight = true , children }) {

    return(
        <Grid item container xs={12} md={4} textAlign='center' alignSelf={changeHeight ? 'stretch' : 'flex-start'}>
            <Card sx={{ p: '80px 24px 40px', flexGrow: 1 }}>
                {
                    ticketPriority !== undefined &&
                    <Label
                    color={priorityVariant}
                    sx={{
                        zIndex: 9,
                        top: 24,
                        left: 24,
                        position: 'absolute',
                        textTransform: 'uppercase',
                    }}
                    >
                        {ticketPriority}
                </Label>
                }
                <Label
                    color={labelColor}
                    sx={{
                        zIndex: 9,
                        top: 24,
                        right: 24,
                        position: 'absolute',
                        textTransform: 'uppercase',
                    }}
                    >
                        {labelText}
                </Label>
                <Box mb={5} display='flex' justifyContent='center'>
                    <Avatar alt={name} src={avatar} sx={{ width: 126, height: 126 }} />
                </Box>
                {children}
            </Card>
        </Grid>
    )
}