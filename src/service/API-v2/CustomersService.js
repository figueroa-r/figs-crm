import axiosInstance from "../FigsCRMBackend";

// get table data
export const getCustomersList = async (
    pageNumber = 0, 
    pageSize = 10, 
    sortingField = 'name', 
    sortingDirection = 'asc'
) => 
    axiosInstance.get(`/customers?page=${pageNumber}&size=${pageSize}&sort=${sortingField},${sortingDirection}`)


export const getCustomerById = async ( customerId ) => axiosInstance.get(`/customers/${customerId}`)


export const createCustomer = async (customerDetails ) => axiosInstance.post('/customers', customerDetails )


export const deleteCustomerById = async ( customerId ) => axiosInstance.delete(`/customers/${customerId}`)
    

export const updateCustomerById = async ( customerId, propsToUpdate ) => axiosInstance.patch(`/customers/${customerId}`, propsToUpdate)