import { useEffect, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// components
import Iconify from '../components/iconify';
import { formatErrorSnackbar } from '../utils/formatErrorMessage';

export default function useTableList(apiGetListFunction, listType, apiDeleteByIdFunction) {
  const emptyWarningTarget = { id: null, name: '' };

  const defaultSortField = listType === 'contacts' ? 'firstName' : listType === 'tickets' ? 'creationDate' : 'name';

  const confirm = useConfirm();

  const { enqueueSnackbar } = useSnackbar();

  // state variables for data received from API
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // state variables for paging and sorting parameters
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(listType === 'tickets' ? 'desc' : 'asc'); // listType is one of ['customers', 'contacts', 'tickets']

  // state for popover menu, table row selections, and filter name string
  const [open, setOpen] = useState(null);
  const [warningTarget, setWarningTarget] = useState(emptyWarningTarget);
  const [selected, setSelected] = useState(new Set());
  const [filterName, setFilterName] = useState('');

  // loading state for feedback (i.e. spinner/progress bar component)
  const [isLoading, setIsLoading] = useState(true);

  // fetch function call...
  const fetchTableData = async () => {
    setIsLoading(true);

    try {

      // fetch table data from endpoint, and update state
      const response = await apiGetListFunction(pageNumber, pageSize, sortField, sortDirection);
      
      setData(response.data.data); 
      setTotalPages(response.data.page.totalPages);
      setTotalElements(response.data.page.totalElements);
    } catch (error) {

      enqueueSnackbar(...formatErrorSnackbar(
        error,
        "Error fetching table data"
      ))      
    } finally {
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line
  }, [pageNumber, pageSize, sortField, sortDirection]);

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = sortField === property && sortDirection === 'asc';
    const direction = isAsc ? 'desc' : 'asc';

    setSortField(property);
    setSortDirection(direction);
  };

  const handleSelectSingleClick = (event, id) => {
    const isAlreadySelected = selected.has(id);
    const updatedSet = new Set(selected);

    if(isAlreadySelected) {
      updatedSet.delete(id)
    } else { updatedSet.add(id) }

    setSelected(updatedSet)
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelected(new Set(newSelecteds));
      return;
    }
    setSelected(new Set());
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setWarningTarget({ id: event.currentTarget.id, name: event.currentTarget.dataset.name });
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleClickDelete = () => {
    setOpen(null);

    confirm({
      description: `This action cannot be undone. Please confirm delete of ${warningTarget.name}.`,
      cancellationButtonProps: { variant: 'outlined' },
      confirmationButtonProps: { variant: 'contained', color: 'error' },
      confirmationText: (<><Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />{'Ok'}</>),
    }).then(async () => {
      
      // when delete is confirmed...
      try {
        
        // call delete function and enqueue snackbar
        await apiDeleteByIdFunction(warningTarget.id)
        enqueueSnackbar(`Deleted ${listType.slice(0, listType.length - 1)}: ${warningTarget.name}`, { variant: 'warning' })
      } catch (error) {

        enqueueSnackbar( ...formatErrorSnackbar(
          error,
          `Error deleting ${listType.slice(0, listType.length - 1)}`
        ))
        

      } finally {

        // update table data
        fetchTableData()
      }
      // catch for cancelling delete of entity
      }).catch(() => setWarningTarget(emptyWarningTarget));
  };

  return {
    data,
    totalPages,
    totalElements,
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    open,
    selected,
    filterName,
    isLoading,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRequestSort,
    handleSelectSingleClick,
    handleSelectAllClick,
    handleFilterByName,
    handleOpenMenu,
    handleCloseMenu,
    handleClickDelete,
  };
}
