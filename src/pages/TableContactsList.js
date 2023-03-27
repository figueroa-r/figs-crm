import { filter } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
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
import { ContactsTableBody } from '../sections/tables'
// API
import { figsCrmAPI } from '../service/FigsCRMBackend';
// Hooks
import useTableList from '../hooks/useTableList'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'firstName', label: 'Name', align: 'left'},
    { id: 'department', label: 'Department', align: 'left'},
    { id: 'title', label: 'Title', align: 'left'},
    { id: 'active', label: 'Active', align: 'center'},
    { id: ''}, // this element is for our menu popover button
]

export default function TableContactsList() {

    const { customerId } = useParams();

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
    } = useTableList(figsCrmAPI.fetchContactsList(customerId), 'contacts', figsCrmAPI.deleteContactById)

    const emptyRows = pageNumber > 0 ? pageSize - data.length : 0;

    const filteredContacts = filter(data, (_contact) => (`${_contact.firstName} ${_contact.lastName}`).trim().toLowerCase().indexOf(filterName.toLowerCase()) !== -1);

    const isNotFound = !filteredContacts.length && !!filterName;

    return (
        <>
          <Helmet>
            <title> Contacts List | Figs-CRM </title>
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
                    <ContactsTableBody
                      contactArray={filteredContacts}
                      selectedContacts={selected}
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