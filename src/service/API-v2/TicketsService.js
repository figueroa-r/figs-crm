import axiosInstance from "../FigsCRMBackend";

// get ticket context => contactsAvatarMap, prioritiesMap, categoriesMap
export const getTicketContext = async ( customerId ) => 
    axiosInstance.get(`/tickets/context?customerId=${customerId}`)

export const getTicketsList = ( customerId ) => async (
    pageNumber = 0,
    pageSize = 10, 
    sortingField = 'creationDate',
    sortingDirection = 'desc'
) =>
    axiosInstance.get(`/tickets?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`)


export const createTicket = async ( ticketDetails ) => axiosInstance.post('/tickets', ticketDetails)

export const getTicketById = async ( ticketId ) => axiosInstance.get(`/tickets/${ticketId}`)

export const updateTicketById = async ( ticketId, updatedProperties ) => axiosInstance.patch(`/tickets/${ticketId}`, updatedProperties)

export const deleteTicketById = async ( ticketId ) => axiosInstance.delete(`/tickets/${ticketId}`)

export const createInteraction = async ( interactionDetails ) => axiosInstance.post('/tickets/ticket-interactions', interactionDetails)