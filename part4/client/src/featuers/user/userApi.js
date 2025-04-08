import axios from "axios"
const BASE_URL = "http://localhost:4000/api/user";

export const serverLogin = (user) => {
    return axios.post(`${BASE_URL}/login`, user);
}

export const serverRegister = (user) => {
    console.log(user);

    return axios.post(BASE_URL, user);
}

export const serverGetSuppliers = () => {
    return axios.get(BASE_URL);
}