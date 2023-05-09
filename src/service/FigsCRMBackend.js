import axios from "axios";


const axiosInstance = axios.create({
    baseURL: "https://avvs4yohf2.execute-api.us-west-2.amazonaws.com/Backend-API/api/v2",
    headers: { "Content-Type": "application/json" },
    auth: {
        username: "guest",
        password: "demo123"
    },
    withCredentials: true
})


axiosInstance.interceptors.response.use(
    (response) => response , 
    (error) =>  Promise.reject(error)
)

export default axiosInstance;
// baseURL: "http://localhost:8080/api/v1"
// baseURL: "https://728pe9uco3.execute-api.us-west-2.amazonaws.com/test/api/v1"
// baseURL: "http://localhost:5000/api/v2"
// baseURL: "https://728pe9uco3.execute-api.us-west-2.amazonaws.com/test/api/v1"
// baseURL: "https://728pe9uco3.execute-api.us-west-2.amazonaws.com/test/api/v1"
// baseURL: "https://avvs4yohf2.execute-api.us-west-2.amazonaws.com/Backend-API/api/v2"


// for our secure backend, we can either return the results, an error, or 401 when there is no/invalid credentials, and 403 with valid credentials 
// but not enough privelages"http://localhost:5000/api/v2"


// for our secure backend, we can either return the results, an error, or 401 when there is no/invalid credentials, and 403 with valid credentials 
// but not enough privelages"http://localhost:5000/api/v2"


// for our secure backend, we can either return the results, an error, or 401 when there is no/invalid credentials, and 403 with valid credentials 
// but not enough privelages


// export const figsCrmAPI = {
//     // customers endpoints
//     getCustomersList: (
//         pageNumber = 0, 
//         pageSize = 10, 
//         sortingField = 'name', 
//         sortingDirection = 'asc') => axiosInstance.get(`/customers?page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),
    
//     getCustomerById: ( customerId ) => axiosInstance.get(`/customers/${customerId}`),

//     createCustomer: ( customerDetails ) => axiosInstance.post('/customers', customerDetails),

//     deleteCustomerById: (customerId) => axiosInstance.delete(`/customers/${customerId}`),
    
//     updateCustomerById: (customerId, propsToUpdate) => axiosInstance.patch(`/customers/${customerId}`, propsToUpdate), // propsToUpdate is an object with {property: value} syntax...

//     // customer contacts endpoints
//     fetchContactsList: ( customerId ) => (
//         pageNumber = 0, 
//         pageSize = 10, 
//         sortingField = 'firstName', 
//         sortingDirection = 'asc') => axiosInstance.get(`/contacts?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),

//     fetchContactById: ( contactId ) => axiosInstance.get(`/contacts/${contactId}`),
//     createContact: ( contactDetails ) => axiosInstance.post('/contacts', contactDetails),
//     deleteContactById: (contactId) => axiosInstance.delete(`/contacts/${contactId}`),
//     deleteContactDetailById: (contactDetailId) => axiosInstance.delete(`/contacts/contact-method/${contactDetailId}`),
//     patchContactById: (contactId, propertiesToUpdate) => axiosInstance.patch(`/contacts/${contactId}`, propertiesToUpdate),

//     // customer tickets endpoints
//     fetchTicketContext: ( customerId ) => Promise.all([axiosInstance.get('/categories'), axiosInstance.get('/priorities'), axiosInstance.get(`/customers/${customerId}/contacts?projection=contactsAvatarList`)]),
//     fetchTicketsList: ( customerId ) => (pageNumber = 0, pageSize = 10, sortingField = 'creationDate', sortingDirection = 'desc')  => axiosInstance.get(`/tickets/search/byCustomerId?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}&projection=ticketIncludeIds`),
//     fetchTicketById: ( ticketId ) => axiosInstance.get(`/tickets/${ticketId}?projection=ticketDetails`),
//     deleteTicketById: ( ticketId ) => axiosInstance.delete(`/tickets/${ticketId}`),
//     createTicket: ( ticketDetails) => axiosInstance.post('/tickets', ticketDetails),
//     updateTicket: ( ticketId, changedTicketFields ) => axiosInstance.patch(`/tickets/${ticketId}`, changedTicketFields),

//     // add interaction 
//     createInteraction: ( interactionDetails ) => axiosInstance.post(`/ticketInteractions`, interactionDetails),

//     // contact me form
//     postNewContactMe: ( contactMeDetails ) => axiosInstance.post('/contactMeForms', contactMeDetails)

// }



// ===================================



// api/v1

// export const figsCrmAPI = {
//     // customers endpoints
//     getCustomersList: (
//         pageNumber = 0, 
//         pageSize = 10, 
//         sortingField = 'name', 
//         sortingDirection = 'asc') => instance.get(`/customers?page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),
    
//     getCustomerById: ( customerId ) => instance.get(`/customers/${customerId}`),
//     createCustomer: ( customerDetails ) => instance.post('/customers', customerDetails),
//     deleteCustomerById: (customerId) => instance.delete(`/customers/${customerId}`),
//     updateCustomerById: (customerId, propsToUpdate) => instance.patch(`/customers/${customerId}`, propsToUpdate), // propsToUpdate is an object with {property: value} syntax...

//     // customer contacts endpoints
//     fetchContactsList: ( customerId ) => (pageNumber = 0, pageSize = 10, sortingField = 'firstName', sortingDirection = 'asc') => instance.get(`/contacts/search/byCustomerId?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),
//     fetchContactById: ( contactId ) => instance.get(`/contacts/${contactId}?projection=contactDetails`),
//     createContact: ( contactDetails ) => instance.post('/contacts', contactDetails),
//     deleteContactById: (contactId) => instance.delete(`/contacts/${contactId}`),
//     deleteContactDetailById: (contactDetailId) => instance.delete(`/contactDetails/${contactDetailId}`),
//     patchContactById: (contactId, propertiesToUpdate) => instance.patch(`/contactsBatch/${contactId}`, propertiesToUpdate),

//     // customer tickets endpoints
//     fetchTicketContext: ( customerId ) => Promise.all([instance.get('/categories'), instance.get('/priorities'), instance.get(`/customers/${customerId}/contacts?projection=contactsAvatarList`)]),
//     fetchTicketsList: ( customerId ) => (pageNumber = 0, pageSize = 10, sortingField = 'creationDate', sortingDirection = 'desc')  => instance.get(`/tickets/search/byCustomerId?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}&projection=ticketIncludeIds`),
//     fetchTicketById: ( ticketId ) => instance.get(`/tickets/${ticketId}?projection=ticketDetails`),
//     deleteTicketById: ( ticketId ) => instance.delete(`/tickets/${ticketId}`),
//     createTicket: ( ticketDetails) => instance.post('/tickets', ticketDetails),
//     updateTicket: ( ticketId, changedTicketFields ) => instance.patch(`/tickets/${ticketId}`, changedTicketFields),

//     // add interaction 
//     createInteraction: ( interactionDetails ) => instance.post(`/ticketInteractions`, interactionDetails),

//     // contact me form
//     postNewContactMe: ( contactMeDetails ) => instance.post('/contactMeForms', contactMeDetails)

// }