import PropTypes from 'prop-types';

import { Card, Grid } from '@mui/material';

FieldsCard.propTypes = {
    children: PropTypes.node
}

export default function FieldsCard({ children }) {
    return (
        <Grid item container xs={12} md={8}>
            <Card sx={{ p: 3, flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {children}
                </Grid>
            </Card>
        </Grid>
    )
}