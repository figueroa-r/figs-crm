import PropTypes from 'prop-types';

// @mui
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemButton } from '@mui/material';

ContactAvatarDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    currentAvatarId: PropTypes.number
}



export default function ContactAvatarDialog({ open, onClose, currentAvatarId }) {
    
    const handleClose = () => {
        onClose(currentAvatarId);
    }

    const handleSelectAvatar = (avatarId) => {
        onClose(avatarId);
    }

    return (
        <Dialog onClose={handleClose} open={open} scroll='paper'>
            <DialogTitle>Select New Avatar</DialogTitle>

            <List>
                {
                   [...Array(24)].map((_, index) => {
                        const avatarId = index + 1;
                        const avatarSrc = `/assets/images/avatars/avatar_${avatarId}.jpg`
                        const isSelected = avatarId === currentAvatarId;

                        return (
                            <ListItem disableGutters key={avatarId} >
                                <ListItemButton onClick={() => handleSelectAvatar(avatarId)} key={avatarId} selected={isSelected} sx={{ justifyContent: 'center' }} >
                                    <Avatar src={avatarSrc} sx={{ width: 126, height: 126 }}/>
                                </ListItemButton>
                            </ListItem>
                        )
                    })
                }
            </List>

        </Dialog>

    )
}