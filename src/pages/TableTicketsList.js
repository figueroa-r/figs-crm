import { Helmet } from 'react-helmet-async';
import { useOutletContext, useParams } from 'react-router-dom';
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
import { TicketsTableBody } from '../sections/tables';
// API
import { figsCrmAPI } from '../service/FigsCRMBackend';
// Hooks
import useTableList from '../hooks/useTableList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'isOpen', label: 'Status', align: 'center'},
    { id: 'creationDate', label: 'Created', align: 'left'},
    { id: 'primaryContact', label: 'Primary Contact', align: 'left'},
    { id: 'category', label: 'Category', align: 'center'},
    { id: 'priority', label: 'Priority', align: 'center'},
    { id: 'ticketNotes', label: 'Description', align: 'left'},
    { id: ''}
]



export default function TableTicketsList() {

    const { categoriesMap, prioritiesMap, contactsMap } = useOutletContext();
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
        // filterName, // not needed since there is no filtering...
        // isLoading,
        handleChangePage,
        handleChangeRowsPerPage,
        handleRequestSort,
        handleSelectSingleClick,
        handleSelectAllClick,
        // handleFilterByName, // not needed since there is not filering by name...
        handleOpenMenu,
        handleCloseMenu,
        handleClickDelete
    } = useTableList(figsCrmAPI.fetchTicketsList(customerId), 'tickets', figsCrmAPI.deleteTicketById)

    const emptyRows = pageNumber > 0 ? pageSize - data.length : 0;

    return (
        <>
            <Helmet>
                <title> Tickets List | Figs-CRM </title>
            </Helmet>

            <Card >
              <TableListToolbar numSelected={selected.size} />
    
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
                    <TicketsTableBody
                      ticketsArray={data}
                      selectedTickets={selected}
                      handleClickCheckbox={handleSelectSingleClick}
                      handleOpenMenu={handleOpenMenu}
                      emptyRows={emptyRows}
                      contactAvatarsMap={contactsMap}
                      categoryMap={categoriesMap}
                      priorityMap={prioritiesMap}
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
    )
    
}