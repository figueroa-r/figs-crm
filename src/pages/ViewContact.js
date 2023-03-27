import { useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import {
    Grid, Typography
} from '@mui/material';

// components
import Iconify from '../components/iconify';
import { AvatarCard, FieldsCard } from '../components/card-containers';




export default function ViewContact() {
    
    const { data: contactData } = useLoaderData();

    const { active, avatarId, firstName, lastName, title, department, contactsList } = contactData;

    const  contactStatus = active ? 'ACTIVE' : 'INACTIVE';
    const statusColor = active ? 'success' : 'error';
    const fullName = (`${firstName} ${lastName}`).trim();
    const avatarSrc = `/assets/images/avatars/avatar_${avatarId}.jpg`;

    const phoneIcon = <Iconify icon='eva:phone-outline' sx={{ display: 'inline-block', verticalAlign: 'text-bottom' }} mr={2} />
    const emailIcon = <Iconify icon='eva:email-outline' sx={{ display: 'inline-block', verticalAlign: 'text-bottom' }} mr={2} />

    return (
        <>
            <Helmet>
                <title> Contact Details | Figs-CRM </title>
            </Helmet>

            <Grid container spacing={{ xs: 2 }}>
                <AvatarCard
                    labelColor={statusColor}
                    labelText={contactStatus}
                    avatar={avatarSrc}
                    name={fullName}
                >
                    <Typography variant='overline' gutterBottom>
                        Name
                    </Typography>
                    <Typography variant='h6'>
                        {fullName}
                    </Typography>
                </AvatarCard>

                <FieldsCard>
                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Department
                        </Typography>
                        <Typography variant='h6'>
                            {department}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} ml={4}>
                        <Typography variant='overline' gutterBottom>
                            Title
                        </Typography>
                        <Typography variant='h6'>
                            {title}
                        </Typography>
                    </Grid>

                    {
                        contactsList.map( contactDetail => (
                            <Grid item xs={12} ml={4} key={contactDetail.id}>
                                <Typography variant='overline' gutterBottom>
                                    {contactDetail.contactType}
                                </Typography>
                                <Typography variant='h6'>
                                    { contactDetail.contactType === 'Phone' ? phoneIcon : emailIcon} {contactDetail.contactDetail}
                                </Typography>
                            </Grid>
                            
                        ))
                    }
                </FieldsCard>
            </Grid>
        </>
    )


}