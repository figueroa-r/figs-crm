import axiosInstance from "../FigsCRMBackend";

export const postNewContactMe = async ( contactMeFields ) =>
    axiosInstance.post('/contact-me', contactMeFields)