import { Link as RouterLink} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Stack, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../components/iconify';


// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  return (
    <>
      <Helmet>
        <title> Figs-CRM | Home </title>
      </Helmet>

      <Container maxWidth="md">
        <Grid container direction='column' alignItems='center'>
          <Grid item>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Welcome, Guest User
            </Typography>
          </Grid>

          {/* <Grid item>
            <Typography variant="h6">
              USERNAME: guest
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" sx={{ mb: 5 }}>
              PASSWORD: demo123
            </Typography>
          </Grid> */}

          <Grid item>
            <Typography variant="body1" sx={{ mb: 5 }} textAlign='center'>
              Figs-CRM is designed to handle all your basic customer information and interactions. Head on over to the customers tab on the left to
              start, or click one of the buttons below!
            </Typography>
          </Grid>

          <Grid item width='100%' mb={5}>
          <Stack 
            direction={{xs: 'column', sm: 'row'}}
            justifyContent='space-around'
            spacing={{xs: 2, sm: 10}}
            >
              <LoadingButton color='inherit' variant='outlined' fullWidth component={RouterLink} to='../customers'> Customers </LoadingButton>
              <LoadingButton color='inherit' variant='outlined' fullWidth component={RouterLink} to='../about'> About </LoadingButton>
              <LoadingButton color='inherit' variant='outlined' fullWidth component={RouterLink} to='../contact'> Contact Me </LoadingButton>
          </Stack>
          </Grid>

          <Grid item width='100%' mb={5}>
          <Stack direction={{xs: 'column', sm: 'row'}} justifyContent='space-evenly'>
            <Stack direction={{ xs: 'column' }} alignItems='center'>
              <IconButton size='large' href='https://github.com/figueroa-r/figs-crm' target='_blank'> 
                <Iconify icon='mdi:source-repository' width={80} />
              </IconButton>
              <Typography variant='h6'>Frontend</Typography>
            </Stack>
            <Stack direction={{ xs: 'column' }} alignItems='center'>
              <IconButton size='large' href='https://github.com/figueroa-r/figs-crm-backend' target='_blank'> 
                <Iconify icon='mdi:source-repository' width={80} />
              </IconButton>
              <Typography variant='h6'>Backend</Typography>
            </Stack>
          </Stack>
          </Grid>


          <Grid
            container
            item
            direction='row'
          >
            {
              technologiesUsed.map(tech => (
                <Grid item xs={12} md={4} key={tech} justifyContent='center' sx={{ margin: 'auto', display: 'flex', py: 2}} >
                  <Iconify icon={tech} sx={{ width: 100 , height: 100 }} color={tech[0] === 's' ? '#6cb52d' : ''}/>
                </Grid>
              ))
            }
          </Grid>


        </Grid>
      </Container>
    </>
  );
}



const technologiesUsed = [
  'logos:material-ui',
  'logos:react',
  'logos:react-router',
  'logos:javascript',
  'logos:spring',
  'simple-icons:springboot',
  'logos:maven',
  'logos:java',
  'logos:mysql',
  'logos:npm',
  'logos:postman',
  'logos:github-icon',
  'openmoji:espresso-machine',
  'logos:stackoverflow'
]