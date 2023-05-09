import { filter } from 'lodash';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Table,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
import { TableListHead, TableListToolbar, TablePopOver } from '../components/table';
// sections
import { CustomerTableBody } from '../sections/tables';
// API
import { getCustomersList, deleteCustomerById } from '../service/API-v2/CustomersService';
// Hooks
import useTableList from '../hooks/useTableList'


// ----------------------------------------------------------------------

// here, we have the values for our different columns. id maps to entity Id and label is for how it is presented

const TABLE_HEAD = [
  { id: 'isVerified', label: 'Verified', align: 'center' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'companyType', label: 'Company Type', align: 'left' },
  { id: 'isActive', label: 'Status', align: 'center' },
  { id: '' } // extra column for popover menu button
];

export default function TableCustomersList() {
  const {
    data,
    // totalPages,
    totalElements,
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    open,
    selected,
    filterName,
    // isLoading,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRequestSort,
    handleSelectSingleClick,
    handleSelectAllClick,
    handleFilterByName,
    handleOpenMenu,
    handleCloseMenu,
    handleClickDelete
  } = useTableList(getCustomersList, 'customers', deleteCustomerById )

  const emptyRows = pageNumber > 0 ? pageSize - data.length : 0;

  const filteredCustomers = filter(data, (_customer) => _customer.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);

  const isNotFound = !filteredCustomers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Customers List | Figs-CRM </title>
      </Helmet>

        <Card >
          <TableListToolbar numSelected={selected.size} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={sortDirection}
                  orderBy={sortField}
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                  numSelected={selected.size}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <CustomerTableBody
                  customerArray={filteredCustomers}
                  selectedCustomers={selected}
                  handleClickCheckbox={handleSelectSingleClick}
                  handleOpenMenu={handleOpenMenu}
                  emptyRows={emptyRows}
                  isNotFound={isNotFound}
                  filterName={filterName}
                />
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, {label: 'All', value: totalElements}]}
            component="div"
            count={totalElements}
            rowsPerPage={pageSize}
            page={pageNumber}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      <TablePopOver
        open={open}
        handleCloseMenu={handleCloseMenu}
        handleClickDelete={handleClickDelete}
      />
    </>
  );
}
