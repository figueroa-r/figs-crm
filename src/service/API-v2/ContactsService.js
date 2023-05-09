import axiosInstance from "../FigsCRMBackend";

// get table data
export const getContactsList = (customerId) => async (
    pageNumber = 0,
    pageSize = 10,
    sortingField = 'firstName',
    sortingDirection = 'asc'
) => 
    axiosInstance.get(`/contacts?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`)

    
export const createContact = async ( contactDetails ) => axiosInstance.post('/contacts', contactDetails)

export const getContactById = async ( contactId ) => axiosInstance.get(`/contacts/${contactId}`)

export const updateContact = async ( contactId, propsToUpdate ) => axiosInstance.patch(`/contacts/${contactId}`, propsToUpdate)

export const deleteContact = async ( contactId ) => axiosInstance.delete(`/contacts/${contactId}`)

export const deleteContactDetail = async ( contactDetailId ) => axiosInstance.delete(`/contacts/contact-method/${contactDetailId}`)