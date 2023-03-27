import PropTypes from 'prop-types';
// @mui
import {
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    Avatar,
    Typography,
    Stack,
    IconButton,
    Paper
} from '@mui/material';

// components
import Iconify from '../../components/iconify';
import Label from '../../components/label';

// ----------------------------------------------------------------------

TicketsTableBody.propTypes = {
    ticketsArray: PropTypes.array,
    selectedTickets: PropTypes.instanceOf(Set),
    handleClickCheckbox: PropTypes.func,
    handleOpenMenu: PropTypes.func,
    emptyRows: PropTypes.number,
    contactAvatarsMap: PropTypes.instanceOf(Map),
    priorityMap: PropTypes.instanceOf(Map),
    categoryMap: PropTypes.instanceOf(Map)
}

export default function TicketsTableBody({
    ticketsArray,
    selectedTickets, // Set() of ticket id's
    handleClickCheckbox,
    handleOpenMenu,
    emptyRows,
    contactAvatarsMap,
    priorityMap,
    categoryMap
}) {

    const ticketIsOpenIcon = <Iconify icon='material-symbols:folder-open-outline-rounded' sx={{ color: 'error.main' }} />
    const ticketIsClosedIcon = <Iconify icon='material-symbols:folder-outline-rounded' sx={{ color: 'text.disabled' }} />

    return (
        <>
            <TableBody>
                {ticketsArray.map((row) => {
                    const { id, isOpen, creationDate, priorityId, categoryId, primaryContactId, ticketNotes } = row;

                    const { fullName: name, avatarId } = contactAvatarsMap.get(primaryContactId);
                    const { name: categoryName, variant: categoryVariant } = categoryMap.get(categoryId);
                    const { name: priorityName, variant: priorityVariant } = priorityMap.get(priorityId);
                    const avatarSrc = `/assets/images/avatars/avatar_${avatarId}.jpg`;

                    const ticketIsSelected = selectedTickets.has(id);

                    return (
                        <TableRow hover key={id} tabIndex={-1} role='checkbox' selected={ticketIsSelected}>
                            <TableCell padding='checkbox'>
                                <Checkbox checked={ticketIsSelected} onChange={(event) => handleClickCheckbox(event, id)} />
                            </TableCell>

                            <TableCell align='center'>
                                { isOpen ? ticketIsOpenIcon : ticketIsClosedIcon }
                            </TableCell>

                            <TableCell align='left'>
                                {creationDate}
                            </TableCell>

                            <TableCell component='th' scope='row' padding='none'>
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <Avatar src={avatarSrc} />
                                    <Typography variant='subtitle2' noWrap>
                                        { 
                                            // eslint-disable-next-line
                                            !!name ? name : 'None Assigned'
                                        }
                                    </Typography>
                                </Stack>
                            </TableCell>

                            <TableCell align='center'>
                                <Label color={categoryVariant.toLowerCase()} variant='soft'>{categoryName}</Label>
                            </TableCell>

                            <TableCell align='center'>
                                <Label color={priorityVariant.toLowerCase()} variant='soft'>{priorityName}</Label>
                            </TableCell>

                            <TableCell align='left' >
                                <Typography variant='subtitle2' sx={{ width: 250 }} noWrap>
                                    {ticketNotes}
                                </Typography>
                            </TableCell>

                            <TableCell align='right'>
                                <IconButton size='large' color='inherit' onClick={handleOpenMenu} key={id} id={id} data-name={`Ticket Number ${id}`}>
                                    <Iconify icon='eva:more-vertical-fill' />
                                </IconButton>
                            </TableCell>

                        </TableRow>
                    )
                    
                })}
                {
                    emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={8} />
                        </TableRow>
                    )
                }

            </TableBody>

            {
                ticketsArray.length === 0 && (
                    <TableBody>
                        <TableRow>
                            <TableCell align='center' colSpan={8} sx={{ py: 3 }}>
                                <Paper sx={{ textAlign: 'center' }}>
                                    <Typography variant='h6' paragraph>
                                        No Tickets
                                    </Typography>

                                    <Typography variant='body2'>
                                        No existing tickets for current customer.
                                        <br/> Click <strong>&quot;{'New Ticket'}&quot;</strong> to get started.
                                    </Typography>
                                </Paper>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )
            }
        </>
    )
}