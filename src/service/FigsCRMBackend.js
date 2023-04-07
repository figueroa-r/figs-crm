import axios from "axios";


const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
})

// baseURL: 
// baseURL: "https://728pe9uco3.execute-api.us-west-2.amazonaws.com/test/api/v1"



export const figsCrmAPI = {
    // customers endpoints
    getCustomersList: (pageNumber = 0, pageSize = 10, sortingField = 'name', sortingDirection = 'asc') => instance.get(`/customers?page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),
    getCustomerById: ( customerId ) => instance.get(`/customers/${customerId}`),
    createCustomer: ( customerDetails ) => instance.post('/customers', customerDetails),
    deleteCustomerById: (customerId) => instance.delete(`/customers/${customerId}`),
    updateCustomerById: (customerId, propsToUpdate) => instance.patch(`/customers/${customerId}`, propsToUpdate), // propsToUpdate is an object with {property: value} syntax...

    // customer contacts endpoints
    fetchContactsList: ( customerId ) => (pageNumber = 0, pageSize = 10, sortingField = 'firstName', sortingDirection = 'asc') => instance.get(`/contacts/search/byCustomerId?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),
    fetchContactById: ( contactId ) => instance.get(`/contacts/${contactId}?projection=contactDetails`),
    createContact: ( contactDetails ) => instance.post('/contacts', contactDetails),
    deleteContactById: (contactId) => instance.delete(`/contacts/${contactId}`),
    deleteContactDetailById: (contactDetailId) => instance.delete(`/contactDetails/${contactDetailId}`),
    patchContactById: (contactId, propertiesToUpdate) => instance.patch(`/contactsBatch/${contactId}`, propertiesToUpdate),

    // customer tickets endpoints
    fetchTicketContext: ( customerId ) => Promise.all([instance.get('/categories'), instance.get('/priorities'), instance.get(`/customers/${customerId}/contacts?projection=contactsAvatarList`)]),
    fetchTicketsList: ( customerId ) => (pageNumber = 0, pageSize = 10, sortingField = 'creationDate', sortingDirection = 'desc')  => instance.get(`/tickets/search/byCustomerId?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}&projection=ticketIncludeIds`),
    fetchTicketById: ( ticketId ) => instance.get(`/tickets/${ticketId}?projection=ticketDetails`),
    deleteTicketById: ( ticketId ) => instance.delete(`/tickets/${ticketId}`),
    createTicket: ( ticketDetails) => instance.post('/tickets', ticketDetails),
    updateTicket: ( ticketId, changedTicketFields ) => instance.patch(`/tickets/${ticketId}`, changedTicketFields),

    // add interaction 
    createInteraction: ( interactionDetails ) => instance.post(`/ticketInteractions`, interactionDetails),

    // contact me form
    postNewContactMe: ( contactMeDetails ) => instance.post('/contactMeForms', contactMeDetails)

}