import api from "./axios";

export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
};