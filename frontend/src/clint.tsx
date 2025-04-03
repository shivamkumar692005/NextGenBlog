import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://backend.221fa04118.workers.dev/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
