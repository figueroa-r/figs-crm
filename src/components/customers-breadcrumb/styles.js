// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

export const StyledBreadcrumbRoot = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '40px'
  }));


export const StyledBreadcrumbContainer = styled(Box)(() => ({
    display: 'box',
    flexGrow: 1
  }))
