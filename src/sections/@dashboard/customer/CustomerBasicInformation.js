import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
// @mui
import {
    Avatar,
    Card,
    FormControlLabel,
    Grid,
    Switch,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Box } from '@mui/system';

// components
import Label from '../../../components/label';
import CustomerForm from './CustomerForm';


// ----------------------------------------------------------------------



export default function CustomerBasicInformation() {

  const customer = useOutletContext();

  // eslint-disable-next-line
    const { // id, 
        avatarUrl, 
        name, 
        // isVerified, 
        status, 
        // companyType 
    } = customer;

    // here we can define our state properties with useState hook from react...
    const [isEditable, setIsEditable] = useState( false );


    return (
      <Grid container spacing={{ xs: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: '80px 24px 40px' }}>
            <Label
              color={(status === 'inactive' && 'error') || 'success'}
              sx={{
                zIndex: 9,
                top: 24,
                right: 24,
                position: 'absolute',
                textTransform: 'uppercase',
              }}
            >
              {status}
            </Label>
            <Box mb={5} display='flex' alignItems='center' justifyContent='center'>
                <Avatar alt={name} src={avatarUrl} sx={{ width: 126, height: 126 }}/>
            </Box>
            <FormControlLabel
                sx={{justifyContent: 'space-between', width: "100%", margin: '0px 0px 24px'}}
                disabled={isEditable === false}
                checked={status === 'active'}
                labelPlacement='start'
                label={
                    <Typography variant='body1' component='span' >
                    <Typography variant='subtitle2' gutterBottom>Active</Typography>
                    <Typography variant='body2' color='text.secondary'>Whether the account is in service or not</Typography>
                    </Typography>}
                control={<Switch color={ status === 'active' ? 'success' : 'error'} size='medium'/>}
                />
            {isEditable === false && <LoadingButton
                size='medium'
                color='primary'
                variant='contained'
                onClick={() => setIsEditable(true)}
                >Edit Customer</LoadingButton>}
          </Card>
        </Grid>



        <Grid item xs={12} md={8}>
          <CustomerForm customer={customer} edit={isEditable} handleCancel={() => setIsEditable(false)} />
        </Grid>



      </Grid>
    );

}