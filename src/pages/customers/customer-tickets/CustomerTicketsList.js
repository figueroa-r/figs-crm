import { filter } from 'lodash';

// react
import React, { useState } from 'react';

// react-router
import { useLoaderData,
    Link as RouterLink,
    useMatches,
    Outlet
} from 'react-router-dom'

// luxon
import { DateTime } from 'luxon';

// @mui
import {
    Avatar,
    Card,
    Checkbox,
    Divider,
    Paper,
    IconButton,
    MenuItem,
    Popover,
    Table,
    Stack,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';

// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { TableListHead, TableListToolbar} from '../../../components/table';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'isOpen', label: 'Status', align: 'center'},
    { id: 'creationDate', label: 'Created', align: 'left'},
    { id: 'primaryContactId', label: 'Primary Contact', align: 'left'},
    { id: 'categoryId', label: 'Category', align: 'center'},
    { id: 'priorityId', label: 'Priority', align: 'center'},
    { id: 'ticketNotes', label: 'Description', align: 'left'},
    { id: ''}
]

// ----------------------------------------------------------------------


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
function getComparator(order, orderBy) {
return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
const stabilizedThis = array.map((el, index) => [el, index]);
stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
});
if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
}
return stabilizedThis.map((el) => el[0]);
}


// ----------------------------------------------------------------------

export default function CustomerTicketsList() {
    

    // matches for conditional render...
  const currentMatches = useMatches();
  const showTable = currentMatches[currentMatches.length - 1].id.indexOf('tabs') !== -1
//   console.log(showTable);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('creationDate');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // data through router loader (similar to useEffect get data) and 
  // router context (similar to props)
  const loader = useLoaderData();
  // id, creationDate, createdBy, primaryContactId, isOpen, categoryId, priorityId, ticketNotes, interactions[]
  const TICKETS_LIST = loader.tickets;
  // id, name, avatarId
  const CONTACTS_LIST = loader.contacts;
  // id, name, variant
  const CATEGORY_MAP = loader.categoryMap;
  // id, name, variant
  const PRIORITY_MAP = loader.priorityMap;

  // const CURRENT_CUSTOMER = useOutletContext();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = TICKETS_LIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - TICKETS_LIST.length) : 0;

  const filteredTickets = applySortFilter(TICKETS_LIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredTickets.length && !!filterName;


  if(showTable) return(
    <>
        <Card >
            <TableListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <TableListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={TICKETS_LIST.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody>
                            {
                                filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    // destructure our ticket from ticketsList
                                    const { id, creationDate, primaryContactId, isOpen, categoryId, priorityId, ticketNotes } = row;
                                    const { name, avatarId} = CONTACTS_LIST.filter(contact => contact.id === primaryContactId)[0]

                                    // boolean indicating whether the name matches our selected value...
                                    const selectedTicket = selected.indexOf(name) !== -1;

                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role='checkbox' selected={selectedTicket}>
                                            <TableCell padding='checkbox'>
                                                <Checkbox checked={selectedTicket} onChange={(event) => handleClick(event, name)} />
                                            </TableCell>

                                            <TableCell align='center'>
                                                {
                                                  isOpen ?
                                                  <Iconify icon='material-symbols:folder-open-outline-rounded' sx={{ color: 'error.main' }} />
                                                  : <Iconify icon='material-symbols:folder-outline-rounded' sx={{ color: 'text.disabled' }} />
                                                }
                                                {/* <Label color={isOpen ? 'error' : 'success'} variant='soft'>{isOpen ? 'OPEN' : 'CLOSED'}</Label> */}
                                            </TableCell>

                                            <TableCell align='left'>{DateTime.fromJSDate(creationDate).toLocaleString(DateTime.DATE_SHORT)}</TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar src={`/assets/images/avatars/avatar_${avatarId}.jpg`}/>
                                                    <Typography variant="subtitle2" noWrap>
                                                    {name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align='center'>
                                                <Label color={CATEGORY_MAP[categoryId].variant} variant='soft'>{CATEGORY_MAP[categoryId].name}</Label>
                                            </TableCell>

                                            <TableCell align='center'>
                                                <Label color={PRIORITY_MAP[priorityId].variant} variant='soft'>{PRIORITY_MAP[priorityId].name}</Label>
                                            </TableCell>

                                            <TableCell align='left'>
                                                <Typography variant='subtitle2' noWrap>
                                                    {ticketNotes}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="right">
                                                <IconButton size="large" color="inherit" onClick={handleOpenMenu} key={id} id={id}>
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
                                  <br /> Try checking for typos or using complete words.
                                </Typography>
                              </Paper>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                </TableContainer>
            </Scrollbar>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={TICKETS_LIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>

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
            },
          },
        }}
      >
        <MenuItem component={RouterLink} to={open?.id} onClick={handleCloseMenu}>
          <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
          View
        </MenuItem>

        <Divider variant='fullWidth' />

        <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                Delete
            </MenuItem>
        </Popover>


    </>
  )

  return <Outlet context={{ contacts: CONTACTS_LIST, categoryMap: CATEGORY_MAP, priorityMap: PRIORITY_MAP}}/>

}
