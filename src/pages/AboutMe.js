import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Grid, Container, Typography, Stack, Avatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';




export default function AboutMe() {

    return (
        <>
            <Helmet>
                <title> Figs-CRM | About Me </title>
            </Helmet>

            <Container maxWidth='md'>
                <Grid container direction='column' alignItems='center' spacing={4}>
                    <Grid item>
                        <Typography variant='h4'>
                            About the Developer
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Avatar
                            src='/assets/images/developer/rfigueroa_headshot.jpg'
                            sx={{ width: 200, height: 200 }}
                            />
                    </Grid>

                    <Grid item>
                        <Typography variant='body1' textAlign='center'>
                            My name is Rafael Figueroa, and I am a full stack software developer. I am currently looking to join a team of passionate developers, with a growth oriented culture. I have a diverse background including skills such as Mechanical Engineering, Customer Service, and Management. If you feel I am a fit for your team, please fill out my contact form to connect!
                        </Typography>
                    </Grid>

                    <Grid item width='100%' mb={5}>
                        <Stack 
                            direction={{xs: 'column', sm: 'row'}}
                            justifyContent='space-around'
                            spacing={{xs: 2, sm: 10}}
                            >
                                <LoadingButton color='inherit' variant='outlined' fullWidth component={RouterLink} to='../customers'> Customers </LoadingButton>
                                <LoadingButton color='inherit' variant='outlined' fullWidth component={RouterLink} to='../home'> Home </LoadingButton>
                                <LoadingButton color='inherit' variant='outlined' fullWidth component={RouterLink} to='../contact'> Contact Me </LoadingButton>
                        </Stack>
                    </Grid>


                </Grid>
            </Container>
        </>
    )
}