import { Helmet } from 'react-helmet-async';
// hooks
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
// @mui
import { Box, Grid, Container, Typography, TextField, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// utils
import { formatErrorSnackbar } from '../utils/formatErrorMessage';

// components
import Iconify from '../components/iconify';

// API
import { postNewContactMe } from '../service/API-v2/ContactMeService';

// form validation
import { contactMeValidationSchema } from '../validationSchemas/ContactMeSchema';






export default function ContactMeForm() {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (values) => {

        try {
            await postNewContactMe(values);
            enqueueSnackbar('Successfully sent contact information!', {variant: 'success'})
            navigate('../home');
        } catch (error) {

            enqueueSnackbar( ...formatErrorSnackbar(
                error,
                'Error Submitting Form'
            ))
        }
    }

    const contactMe = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            contactNote: ''
        },
        validationSchema: contactMeValidationSchema,
        onSubmit: handleSubmit
    })

    return (
        <form noValidate onSubmit={contactMe.handleSubmit}>
            <Helmet>
                <title> Figs-CRM | Contact Me </title>
            </Helmet>

            <Container maxWidth='sm' >
                <Grid container direction='column' alignItems='center' justifyContent='center'>

                    <Grid item>
                        <Typography variant='h4' sx={{ mb: 5 }}>
                            Get in Touch
                        </Typography>
                    </Grid>

                    <Box sx={{ width: '100%'}}>
                        <Grid item xs={12} sx={{ mb: 3 }} width='inherit'>
                            <TextField
                                name='fullName'
                                required
                                fullWidth
                                id='fullName'
                                label='Full Name' 
                                value={contactMe.values.fullName}
                                onChange={contactMe.handleChange}
                                error={Boolean(contactMe.errors.fullName && contactMe.touched.fullName)}
                                helperText={contactMe.touched.fullName && contactMe.errors.fullName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Iconify icon='eva:person-outline' />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ mb: 3 }}  width='inherit'>
                            <TextField
                                name='email'
                                required
                                fullWidth
                                id='email'
                                label='Email Address'
                                value={contactMe.values.email}
                                onChange={contactMe.handleChange}
                                error={Boolean(contactMe.errors.email && contactMe.touched.email)}
                                helperText={contactMe.touched.email && contactMe.errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Iconify icon='eva:email-outline' />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ mb: 3 }}  width='inherit'>
                            <TextField
                                name='phone'
                                required
                                fullWidth
                                id='phone'
                                label='Phone Number' 
                                value={contactMe.values.phone}
                                onChange={contactMe.handleChange}
                                error={Boolean(contactMe.errors.phone && contactMe.touched.phone)}
                                helperText={contactMe.touched.phone && contactMe.errors.phone}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Iconify icon='eva:phone-outline' />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ mb: 3 }}  width='inherit'>
                            <TextField
                                name='contactNote'
                                required
                                fullWidth
                                id='contactNote'
                                label='Contact Note'
                                multiline
                                minRows={3}
                                value={contactMe.values.contactNote}
                                onChange={contactMe.handleChange}
                                error={Boolean(contactMe.errors.contactNote && contactMe.touched.contactNote)}
                                helperText={contactMe.touched.contactNote && contactMe.errors.contactNote}
                            />
                        </Grid>
                        <Grid item xs={12} width='inherit' textAlign='center'>
                            <LoadingButton
                                loading={contactMe.isSubmitting}
                                type='submit'
                                size='medium'
                                variant='outlined'
                                disabled={!contactMe.dirty}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit Contact Info
                            </LoadingButton>
                        </Grid>
                        
                    </Box>
                    
                </Grid>
            </Container>
        </form>
    )
}