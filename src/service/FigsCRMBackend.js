import axios from "axios";


const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
})



export const figsCrmAPI = {
    // pass in parameters to modify pageNumber, pageSize, sortingField, and sortingDirection of requested resource...
    // state should drive this request, and if a parameter is not included, it will result in default values
    getCustomersByPageAndSort: (
        pageNumber = 0,
        pageSize = 10 ,
        sortingField = 'name',
        sortingDirection = 'asc' ) => instance.get(`/customers?page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),

    deleteCustomerById: ( customerId ) => instance.delete(`/customers/${customerId}`),

    getCustomerById: ( customerId ) => instance.get(`/customers/${customerId}`),

    getContactsByCustomerIdPageAndSort: ( 
        customerId,
        pageNumber = 0,
        pageSize = 10,
        sortingField = 'firstName',
        sortingDirection = 'asc' ) => instance.get(`/contacts/search/byCustomerId?customerId=${customerId}&page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`),

    getCustomerContactsDropdown: ( customerId ) => instance.get(`/customers/${customerId}/contacts?projection=contactsAvatarList`),

    deleteContactById: ( contactId ) => instance.delete(`/contacts/${contactId}`)


}