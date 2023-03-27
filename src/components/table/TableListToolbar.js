import PropTypes from 'prop-types';
// @mui
import { IconButton, InputAdornment, Tooltip, Typography } from '@mui/material';
// component
import Iconify from '../iconify';
// styled components
import { StyledToolbarRoot, StyledSearch } from './styles';

// ----------------------------------------------------------------------

TableListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function TableListToolbar({ numSelected, filterName, onFilterName }) {
  return (
    <StyledToolbarRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : ( onFilterName !== undefined) ? 
        (<StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search current results..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      ) : (<Typography component="div" variant="subtitle1">
          Select a Ticket to view Interactions
      </Typography>)
      }

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </StyledToolbarRoot>
  );
}
