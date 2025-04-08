import axios from "axios"
const BASE_URL = "http://localhost:4000/api/order";

export const confirmOrderBySupplier = (id) => {
    return axios.put(`${BASE_URL}/${id}`);
}

export const completeOrder = (id) => {
    return axios.put(`${BASE_URL}/completed/${id}`);
}

export const createOrder = (order) => {
    return axios.post(BASE_URL, order);
}

export const getAllOrders = (status, page, limit) => {
    return axios.get(`${BASE_URL}/?status=${status}&limit=${limit}&page=${page}`);
}

export const getSupplierOrders = () => {
    return axios.get(`${BASE_URL}/supplierOrders`);
}

export const getTotalPages = (limit) => {
    return axios.get(`${BASE_URL}/totalPages?limit=${limit}`);
}