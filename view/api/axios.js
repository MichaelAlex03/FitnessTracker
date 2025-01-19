import axios from 'axios';
const BASE_URL = `http://${process.env.EXPO_PUBLIC_IP}:3000`

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})