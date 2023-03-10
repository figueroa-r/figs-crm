import { filter } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Avatar, Backdrop,
  Card, Checkbox, CircularProgress, Divider, IconButton, MenuItem, Paper, Popover,
  Stack, Table, TableBody,
  TableCell, TableContainer,
  TablePagination, TableRow, Typography
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
// sections
import { CustomerListHead, CustomerListToolbar } from '../../sections/@dashboard/customer';

// backend API
import { figsCrmAPI } from '../../service/FigsCRMBackend';


// ----------------------------------------------------------------------

// here, we have the values for our different columns. id maps to entity Id and label is for how it is presented

const TABLE_HEAD = [
  { id: 'isVerified', label: 'Verified', align: 'center' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'companyType', label: 'Company Type', align: 'left' },
  { id: 'isActive', label: 'Status', align: 'center' },
  { id: '' } // extra column for popover menu
];

// ----------------------------------------------------------------------

export default function CustomerList() {

  const [ data, setData ] = useState({ customerList: [], page: {number: 0, size: 10, totalElements: 0, totalPages: 0}, sortField: 'name', sortDirection: 'asc' });

  const [ loading, setLoading ] = useState( false );

  const [selected, setSelected] = useState([]);

  const [open, setOpen] = useState(null);

  const [filterName, setFilterName] = useState('');

  const [alert, setAlert] = useState({ customerName: '', customerId: null});

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  useEffect( () => {
    const getDataFromBackend = async () => {
      setLoading(true); // activate loading indicator
      const response = await figsCrmAPI.getCustomersByPageAndSort( 0, 10, data.sortField, data.sortDirection )
      // console.log(response);
      setData({ ...data, customerList: response.data._embedded.customers, page: response.data.page }); // destructure our response and format for easier access in state
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
      .getCustomersByPageAndSort( data.page.number, data.page.size, property, direction )
      .then( (response) => {
        setData({ customerList: response.data._embedded.customers, page: response.data.page, sortField: property, sortDirection: direction })
        setLoading(false);
      })
      .catch( (error) => console.log(error) );

  };

  // adds all customers on current page to selection (including those filtered out, excluding from other pages)
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.customerList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // only filters current page by name
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };


  // handles checking the box next to a customer
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
      .getCustomersByPageAndSort( newPage, data.page.size, data.sortField, data.sortDirection ) // maintain current sortField & sortDirection
      .then( (response) => {
        setData({ ...data, customerList: response.data._embedded.customers, page: response.data.page }); // including page data in the event of new/deleted entries
        setLoading( false );
      })
      .catch( (error) => console.log(error) );
  }

  const handleChangeRowsPerPage = ( event ) => {
    setLoading(true);
    figsCrmAPI
      .getCustomersByPageAndSort( 0, parseInt(event.target.value, 10), data.sortField, data.sortDirection ) // maintain current sortField & sortDirection
      .then( (response) => {
        setData({ ...data, customerList: response.data._embedded.customers, page: response.data.page }); // including page data in the event of new/deleted entries
        setLoading( false );
      })
      .catch( (error) => console.log(error) );
  }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setAlert({ customerName: event.currentTarget.dataset.name, customerId: event.currentTarget.id });
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // delete confirmation dialog

  const handleClickDelete = () => {
    setOpen(null);

    confirm(
      {
        description: `This action cannot be undone. Please confirm delete of ${alert.customerName}. This will also delete all related contacts and tickets`,
        cancellationButtonProps: {variant: 'outlined'},
        confirmationButtonProps: {variant: 'contained', color: 'error'},
        confirmationText: <><Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />{'Ok'}</>
      })
      .then(() => {
        console.log(`deleted customer with id: ${alert.customerId}`)
        figsCrmAPI
          .deleteCustomerById(alert.customerId)
          .then( () => {
            // create snackbar
            enqueueSnackbar(`Deleted Customer: ${alert.customerName}`, {variant: 'warning'})
            // get data and update data
            setLoading(true);
            figsCrmAPI
              .getCustomersByPageAndSort( data.page.number, data.page.size, data.sortField, data.sortDirection)
              .then( (response) => {
                setData({ ...data, customerList: response.data._embedded.customers, page: response.data.page })
                setLoading(false);
              })
              .catch( (error) => console.log(error) )
          })
          .catch( (error) => console.log(error) )
        setAlert({ customerName: '', customerId: null })
      })
      .catch(() => {
        console.log('cancelled confirm delete')
        setAlert({ customerName: '', customerId: null })
      })
  }

  const emptyRows = data.page.number > 0 ? data.page.size - data.customerList.length : 0;

  const filteredCustomers = filter(data.customerList, (_customer) => _customer.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);

  const isNotFound = !filteredCustomers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Customers List | Figs-CRM </title>
      </Helmet>

        { loading === true ? 
        <Backdrop open={loading}>
        <CircularProgress />
        </Backdrop> : 
        <Card >
          <CustomerListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CustomerListHead
                  order={data.sortDirection}
                  orderBy={data.sortField}
                  headLabel={TABLE_HEAD}
                  rowCount={data.customerList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCustomers.map((row) => {
                    const { id, avatarUrl, name, isActive, companyType, isVerified } = row;
                    const selectedCustomer = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedCustomer}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedCustomer} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell align="center">{isVerified ? 
                          <Iconify icon='eva:checkmark-circle-fill' sx={{color: 'success.dark'}} /> 
                          : <Iconify icon='eva:clock-outline' sx={{color: 'warning.main'}} />}
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
                            <br /> Try checking for typos, using complete words, or a different page.
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
        </Card>}

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
        <MenuItem component={RouterLink} to={open?.id}>
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
  );
}