import { Link as RouterLink, useMatches } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { 
    Box,
    Breadcrumbs, 
    Button,
    Link, 
    Slide, 
    Stack,
    Typography } from '@mui/material';

// styled components
import { StyledBreadcrumbContainer, StyledBreadcrumbRoot } from './styles';



// ----------------------------------------------------------------------


export default function CustomersBreadcrumb() {
    const matches = useMatches();
    const crumbs = matches
        .filter((match) => Boolean(match.handle?.crumb));

    const currentCrumb = crumbs.pop();
    const showNewButton = currentCrumb.handle?.button !== undefined;

    return (
        <StyledBreadcrumbRoot>
            <StyledBreadcrumbContainer>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                    <Typography variant='h4' gutterBottom key={currentCrumb.id}>
                        {currentCrumb.handle.pageTitle}
                    </Typography>
                    {
                    showNewButton && 
                    <Slide direction="up" in mountOnEnter unmountOnExit>
                        <Button
                            variant='contained'
                            component={RouterLink} 
                            to={currentCrumb.handle.button.link}
                            relative='path'
                            >
                                {currentCrumb.handle.button.name}
                        </Button>
                    </Slide>
                    }
                </Stack>

                <Breadcrumbs aria-label='breadcrumb' separator={<Separator component={'div'} />}>
                    {
                        crumbs.map(({ id, pathname, handle: {crumb}, data }) => (
                            <Link 
                                to={pathname} 
                                key={id} 
                                relative='path' 
                                component={RouterLink} 
                                underline='hover' 
                                color='text.primary' 
                                variant='body1'>
                                    {crumb(data?.data)}
                            </Link>
                        ))
                    }
                    <Typography variant='body1' key={currentCrumb.id}>
                        {currentCrumb.handle.crumb(currentCrumb.data?.data)}
                    </Typography>
                </Breadcrumbs>

            </StyledBreadcrumbContainer>
        </StyledBreadcrumbRoot>
    )
}


// ----------------------------------------------------------------------

// we can define a custom separator

const Separator = styled(Box) (({ theme }) => ({
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.disabled,
  }));