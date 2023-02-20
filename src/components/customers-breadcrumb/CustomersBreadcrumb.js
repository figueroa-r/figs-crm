import { Link as RouterLink, useMatches } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { 
    Box,
    Breadcrumbs, 
    Link, 
    Typography } from '@mui/material';

// styled components
import { StyledBreadcrumbContainer, StyledBreadcrumbRoot } from './styles';



// ----------------------------------------------------------------------


export default function CustomersBreadcrumb() {
    const matches = useMatches();
    const crumbs = matches
        .filter((match) => Boolean(match.handle?.crumb));

    const currentCrumb = crumbs.pop();

    // console.log(matches);
    // console.log(crumbs);
    // console.log(currentCrumb);

    return (
        <StyledBreadcrumbRoot>
            <StyledBreadcrumbContainer>

                <Typography variant='h4' gutterBottom key={currentCrumb.id}>
                    {currentCrumb.handle.pageTitle(currentCrumb.data)}
                </Typography>

                <Breadcrumbs aria-label='breadcrumb' separator={<Separator component={'div'} />}>
                    {
                        crumbs.map(({ id, pathname, handle: {crumb} }) => (
                            <Link 
                                to={pathname} 
                                key={id} 
                                relative='path' 
                                component={RouterLink} 
                                underline='hover' 
                                color='text.primary' 
                                variant='body1'>
                                    {crumb}
                            </Link>
                        ))
                    }
                    <Typography variant='body1' key={currentCrumb.id}>
                        {currentCrumb.handle.crumb}
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