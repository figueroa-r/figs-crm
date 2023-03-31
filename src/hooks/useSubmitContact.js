import { useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// components
import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

const emptyContact = { 
    active: true, 
    avatarId: NaN, 
    firstName: '', 
    lastName: '', 
    title: '', 
    department: ''
}

// ----------------------------------------------------------------------


export default function useSubmitContact( intialContactData, intialContactMethods ) {

    // dialog/snackbar for when contact methods get deleted...
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();


    // We want logic to hold our contact values....
    const [customerData, setCustomerData] = useState({})
    // as well as our contact methods
    const [existingMethods, setExistingMethods] = useState([])


    // contact method states
    const [newMethods, setNewMethods] = useState([])



    // state variable for when to make the button active...
    // -- changes are made to any of the fields that are different from before...
    // -- new contact methods are created...
    // -- existing contact methods are changed from before


    // delete method
    // create method - save method
    // create method - associate method
    // update method



    // update contact
    // -- change contact input fields
    // -- change method input fields (both existing and new)
    // -- create new methods (using placeholder id)
    // -- delete exisiting methods (using placeholder id/index)
    // -- delete new methods (using placeholder id/index)
    // (SAVE) => update contact
    // -- update new/existing method

    // create contact
    // -- change input fields
    // -- create new methods
    // -- delete new methods
    // (SAVE) => create contact






    // we can decouple the operation of deleting a contact method
    // -- deleting existing contactMethods will delete it from the repository after calling useConfirm dialog
    // -- deleting new contactMethod will simply remove it from the new list

    // next, we can create new entities first? or do this on updating...






    
}