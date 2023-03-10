import { filter } from 'lodash';
// react
import React, { useState, useEffect } from 'react';
// react-router
import {
  useMatches, 
  Outlet,
  useNavigate,
  useParams
   } from 'react-router-dom';

import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// @mui
import {
    Avatar,
    Backdrop,
    Card,
    Checkbox,
    CircularProgress,
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
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import { TableListHead, TableListToolbar} from '../../../../components/table';

// api
import { figsCrmAPI } from '../../../../service/FigsCRMBackend';




// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'firstName', label: 'Name', align: 'left'},
    { id: 'department', label: 'Department', align: 'left'},
    { id: 'title', label: 'Title', align: 'left'},
    { id: 'active', label: 'Active', align: 'center'},
    { id: ''}, // this element is for our menu popover button
]

// ----------------------------------------------------------------------

export default function CustomerContactsList() {

  // useNavigate hook for drilling down
  const navigate = useNavigate();

  // matches for conditional render of tabs...
  const currentMatches = useMatches();
  const showTable = currentMatches[currentMatches.length - 1].id.indexOf('tabs') !== -1

  const { customerId } = useParams();

  // state for contacts table

  const [ data, setData ] = useState({ contactList: [], page: {number: 0, size: 10, totalElements: 0, totalPages: 0}, sortField: 'firstName', sortDirection: 'asc' });

  const [ loading, setLoading ] = useState( false );

  const [selected, setSelected] = useState([]);

  const [open, setOpen] = useState(null);

  const [filterName, setFilterName] = useState('');

  const [alert, setAlert] = useState({ contactName: '', contactId: null});

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  useEffect( () => {
    const getDataFromBackend = async () => {
      setLoading(true); // activate loading indicator
      const response = await figsCrmAPI.getContactsByCustomerIdPageAndSort( customerId, 0, 10, data.sortField, data.sortDirection )
      setData({ ...data, contactList: response.data._embedded.contacts, page: response.data.page }); // destructure our response and format for easier access in state
      setLoading(false);
    }
    getDataFromBackend();
    // eslint-disable-next-line
  }, [])


  const handleRequestSort = (event, property) => {
    const isAsc = data.sortField === property && data.sortDirection === 'asc';
    const direction = isAsc ? 'desc' : 'asc';

    setLoading(true);
    figsCrmAPI
      .getContactsByCustomerIdPageAndSort( customerId, data.page.number, data.page.size, property, direction )
      .then( (response) => {
        setData({ contactList: response.data._embedded.contacts, page: response.data.page, sortField: property, sortDirection: direction })
        setLoading(false);
      })
      .catch( (error) => console.log(error) );

  };

  // adds all contacts on current page to selection (including those filtered out, excluding from other pages)
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.contactList.map((n) => (`${n.firstName} ${n.lastName}`).trim());
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // only filters current page by name
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };


  // handles checking the box next to a contact
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
    setLoading(true);
    figsCrmAPI
      .getContactsByCustomerIdPageAndSort( customerId, newPage, data.page.size, data.sortField, data.sortDirection ) // maintain current sortField & sortDirection
      .then( (response) => {
        setData({ ...data, contactList: response.data._embedded.contacts, page: response.data.page }); // including page data in the event of new/deleted entries
        setLoading( false );
      })
      .catch( (error) => console.log(error) );
  }

  const handleChangeRowsPerPage = ( event ) => {
    setLoading(true);
    figsCrmAPI
      .getContactsByCustomerIdPageAndSort( customerId, 0, parseInt(event.target.value, 10), data.sortField, data.sortDirection ) // maintain current sortField & sortDirection
      .then( (response) => {
        setData({ ...data, contactList: response.data._embedded.contacts, page: response.data.page }); // including page data in the event of new/deleted entries
        setLoading( false );
      })
      .catch( (error) => console.log(error) );
  }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setAlert({ contactName: event.currentTarget.dataset.name, contactId: event.currentTarget.id });
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleClickViewContactDetails = () => {
    const toUrl = open?.id;
    handleCloseMenu();
    navigate(toUrl);
  }

  const handleClickDelete = () => {
    setOpen(null);

    confirm(
      {
        description: `This action cannot be undone. Please confirm delete of ${alert.contactName}. This will also remove their association to tickets.`,
        cancellationButtonProps: {variant: 'outlined'},
        confirmationButtonProps: {variant: 'contained', color: 'error'},
        confirmationText: <><Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />{'Ok'}</>
      })
      .then(() => {
        // console.log(`deleted contact with id: ${alert.contactId}`)
        figsCrmAPI
          .deleteContactById(alert.contactId)
          .then( () => {
            // create snackbar
            enqueueSnackbar(`Deleted Contact: ${alert.contactName}`, {variant: 'warning'})
            // get data and update data
            setLoading(true);
            figsCrmAPI
              .getContactsByCustomerIdPageAndSort( customerId, data.page.number, data.page.size, data.sortField, data.sortDirection)
              .then( (response) => {
                setData({ ...data, contactList: response.data._embedded.contacts, page: response.data.page })
                setLoading(false);
              })
              .catch( (error) => console.log(error) )
          })
          .catch( (error) => console.log(error) )
        setAlert({ contactName: '', contactId: null })
      })
      .catch(() => {
        console.log('cancelled confirm delete')
        setAlert({ contactName: '', contactId: null })
      })
  }

  const emptyRows = data.page.number > 0 ? data.page.size - data.contactList.length : 0;

  const filteredContacts = filter(data.contactList, (_contact) => (`${_contact.firstName} ${_contact.lastName}`).trim().toLowerCase().indexOf(filterName.toLowerCase()) !== -1);

  const isNotFound = !filteredContacts.length && !!filterName;


  if(showTable) return(
    <>
        <Card >
        { loading === true && <Backdrop open={loading}><CircularProgress /></Backdrop> }
            <TableListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <TableListHead
                            order={data.sortDirection}
                            orderBy={data.sortField}
                            headLabel={TABLE_HEAD}
                            rowCount={data.contactList.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody>
                            {
                                filteredContacts.map((row) => {
                                    // destructure our contacts list
                                    const { id, avatarId, firstName, lastName, title, department, active } = row;
                                    const name = `${firstName} ${lastName}`;

                                    // boolean indicating whether the name matches our selected value...
                                    const selectedContact = selected.indexOf(name) !== -1;

                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role='checkbox' selected={selectedContact}>
                                            <TableCell padding='checkbox'>
                                                <Checkbox checked={selectedContact} onChange={(event) => handleClick(event, name)} />
                                            </TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar src={`/assets/images/avatars/avatar_${avatarId}.jpg`}/>
                                                    <Typography variant="subtitle2" noWrap>
                                                    {name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align='left'>{department}</TableCell>

                                            <TableCell align='left'>{title}</TableCell>

                                            <TableCell align='center'>
                                                <Label color={active ? 'success' : 'error'} variant='soft'>{active ? 'ACTIVE' : 'INACTIVE'}</Label>
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
              rowsPerPageOptions={[5, 10, 20, {label: 'All', value: data.page.totalElements}]}
              component="div"
              count={data.page.totalElements}
              rowsPerPage={data.page.size}
              page={data.page.number}
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
        <MenuItem onClick={handleClickViewContactDetails}>
          <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
          View
        </MenuItem>

        <Divider variant='fullWidth' />

        <MenuItem sx={{ color: 'error.main' }} onClick={handleClickDelete}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                Delete
            </MenuItem>
        </Popover>


    </>
  )

  return <Outlet />

}
