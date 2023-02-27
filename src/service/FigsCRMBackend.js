import axios from "axios";


const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
})



export const figsCrmAPI = {
    getCustomersList: () => {
        let resp = {
            alert: null,
            data: null
        }

        try {
            resp.data = JSON.parse(instance.get('/customers'));
        } catch (error) {
            console.log(error);
            resp.alert = error;
        }

        return resp;
    },

    getCustomerInformation: ( customerId ) => instance.get(`/customers/${customerId}`),


}