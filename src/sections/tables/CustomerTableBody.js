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

CustomerTableBody.propTypes = {
    customerArray: PropTypes.array,
    selectedCustomers: PropTypes.instanceOf(Set),
    handleClickCheckbox: PropTypes.func,
    handleOpenMenu: PropTypes.func,
    emptyRows: PropTypes.number,
    isNotFound: PropTypes.bool,
    filterName: PropTypes.string
}

export default function CustomerTableBody({ 
    customerArray, 
    selectedCustomers, 
    handleClickCheckbox, 
    handleOpenMenu, 
    emptyRows,
    isNotFound,
    filterName }) {

    return (
        <>
        <TableBody>
            {customerArray.map((row) => {
                const { id, avatarUrl, name, isActive, companyType, isVerified } = row;
                const isSelectedCustomer = selectedCustomers.has(id);


                return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={isSelectedCustomer}>
                        <TableCell padding="checkbox">
                            <Checkbox checked={isSelectedCustomer} onChange={(event) => handleClickCheckbox(event, id)} />
                        </TableCell>

                        <TableCell align="center">
                            {isVerified ? 
                            <Iconify icon='eva:checkmark-circle-fill' sx={{color: 'success.dark'}} /> 
                            : <Iconify icon='eva:clock-outline' sx={{color: 'warning.main'}} 
                            />}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl}>{name[0]}</Avatar>
                            <Typography variant="subtitle2" noWrap>
                                {name}
                            </Typography>
                            </Stack>
                        </TableCell>

                        <TableCell align="left">{companyType}</TableCell>

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

        </>
    )
}