import axiosInstance from "../FigsCRMBackend";

export const authLogout = async () =>
    axiosInstance.get('/logout')