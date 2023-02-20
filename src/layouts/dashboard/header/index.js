import PropTypes from 'prop-types';
// @mui
import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
// ----------------------------------------------------------------------

// This section includes parameters on viewport sizing as well as our styles...
// it calls on our theme palette

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

// here we pass in the standard mui components into the styled() hook...
// it allows us to pass in custom styles...
const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Box sx={{ flexGrow: 1.12 }} />

        <Iconify icon="mdi:customer-service" sx={{ color: 'text.primary', mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          sx={{
            display: 'flex',
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '.2rem',
            color: 'text.primary',
            textDecoration: 'none',
          }}
        >
          FIGS-CRM
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
