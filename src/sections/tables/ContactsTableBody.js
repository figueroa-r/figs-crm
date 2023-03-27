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

ContactsTableBody.propTypes = {
    contactArray: PropTypes.array,
    selectedContacts: PropTypes.instanceOf(Set),
    handleClickCheckbox: PropTypes.func,
    handleOpenMenu: PropTypes.func,
    emptyRows: PropTypes.number,
    isNotFound: PropTypes.bool,
    filterName: PropTypes.string
}

export default function ContactsTableBody({ 
    contactArray, 
    selectedContacts, 
    handleClickCheckbox, 
    handleOpenMenu, 
    emptyRows,
    isNotFound,
    filterName }) {

    const isEmptyPage = contactArray.length === 0 && filterName === ''

    return (
        <>
        <TableBody>
            {contactArray.map((row) => {
                const { id, avatarId, firstName, lastName, title, department, active: isActive } = row;
                const name = (`${firstName} ${lastName}`).trim();
                const avatarUrl = `/assets/images/avatars/avatar_${avatarId}.jpg`

                const selectedContact = selectedContacts.has(id);

                return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedContact}>
                        <TableCell padding="checkbox">
                            <Checkbox checked={selectedContact} onChange={(event) => handleClickCheckbox(event, id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl}>{name[0]}</Avatar>
                            <Typography variant="subtitle2" noWrap>
                                {name}
                            </Typography>
                            </Stack>
                        </TableCell>

                        <TableCell align="left">{department}</TableCell>

                        <TableCell align="left">{title}</TableCell>

                        <TableCell align="center">
                            <Label color={ isActive ? 'success' : 'error'} variant='soft'>{ isActive ? 'ACTIVE' : 'INACTIVE'}</Label>
                        </TableCell>

                        <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu} key={id} id={id} data-name={name}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    );
            })}
            {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                </TableRow>
            )}
        </TableBody>

        {isNotFound && (
            <TableBody>
            <TableRow>
                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                <Paper
                    sx={{
                    textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" paragraph>
                    Not found
                    </Typography>

                    <Typography variant="body2">
                    No results found for &nbsp;
                    <strong>&quot;{filterName}&quot;</strong>.
                    <br /> Try checking for typos, using complete words, or loading more results.
                    </Typography>
                </Paper>
                </TableCell>
            </TableRow>
            </TableBody>
        )}

        {
                isEmptyPage && (
                    <TableBody>
                        <TableRow>
                            <TableCell align='center' colSpan={8} sx={{ py: 3 }}>
                                <Paper sx={{ textAlign: 'center' }}>
                                    <Typography variant='h6' paragraph>
                                        No Contacts
                                    </Typography>

                                    <Typography variant='body2'>
                                        No existing contacts for current customer.
                                        <br/> Click <strong>&quot;{'New Contact'}&quot;</strong> to get started.
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