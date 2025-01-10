import axios from 'axios';
import { IP } from '@env'

export default axios.create({
    baseURL: `http://${IP}`,
});