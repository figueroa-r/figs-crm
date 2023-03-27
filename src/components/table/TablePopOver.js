import PropTypes from 'prop-types';
// react-router
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Popover, MenuItem, Divider } from '@mui/material';
// component
import Iconify from '../iconify';

// ----------------------------------------------------------------------

TablePopOver.propTypes = {
    open: PropTypes.object,
    handleCloseMenu: PropTypes.func,
    handleClickDelete: PropTypes.func
}


export default function TablePopOver({ open, handleCloseMenu, handleClickDelete }) {

    return (

        <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
                sx: {
                    p: 1,
                    width: 140,
                    '& .MuiMenuItem-root': {
                        px: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                    }
                }
            }}
        >
            <MenuItem component={RouterLink} to={open?.id}>
                <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
                View
            </MenuItem>
            
            <MenuItem component={RouterLink} to={`${open?.id}/edit`}>
                <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                Edit
            </MenuItem>

            <Divider variant='fullWidth' />

            <MenuItem sx={{ color: 'error.main' }} onClick={handleClickDelete} >
                <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                Delete
            </MenuItem>

        </Popover>
    )
}