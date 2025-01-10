import axios from 'axios';

export default axios.create({
    baseURL: `http://${process.env.EXPO_PUBLIC_IP}`,
});