import { Helmet } from 'react-helmet-async';
// react
import React, { useState } from 'react';
// hooks
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { Box, Grid, Container, Typography, TextField, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../components/iconify';

// API
import { figsCrmAPI } from '../service/FigsCRMBackend';




export default function ContactMeForm() {

    const navigate = useNavigate();

    const [formFields, setFormFields] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        contactNote: ''
    })

    const { enqueueSnackbar } = useSnackbar();


    const handleChangeForm = (event) => {
        setFormFields({
            ...formFields,
            [event.target.id]: event.target.value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await figsCrmAPI.postNewContactMe(formFields);
            enqueueSnackbar('Successfully sent contact information!', {variant: 'success'})
            navigate('../home');
        } catch (error) {
            console.log(error)
            enqueueSnackbar('Error submitting the form, try again', { variant: 'error' })
        }
    }

    return (
        <>
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

                    <Box component='form' sx={{ width: '100%'}} onSubmit={handleSubmit}>
                        <Grid item xs={12} sx={{ mb: 3 }} width='inherit'>
                            <TextField
                                name='fullName'
                                required
                                fullWidth
                                id='fullName'
                                label='Full Name' 
                                value={formFields.fullName}
                                onChange={handleChangeForm}
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
                                value={formFields.email}
                                onChange={handleChangeForm}
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
                                name='phoneNumber'
                                required
                                fullWidth
                                id='phoneNumber'
                                label='Phone Number' 
                                value={formFields.phoneNumber}
                                onChange={handleChangeForm}
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
                                value={formFields.contactNote}
                                onChange={handleChangeForm}
                            />
                        </Grid>
                        <Grid item xs={12} width='inherit' textAlign='center'>
                            <LoadingButton
                                type='submit'
                                size='medium'
                                variant='outlined'
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit Contact Info
                            </LoadingButton>
                        </Grid>
                        
                    </Box>
                    
                </Grid>
            </Container>
        </>
    )
}