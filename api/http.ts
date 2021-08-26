import axios from 'axios';

const http = axios.create({
    baseURL: '/api',
    timeoutErrorMessage: 'Connection timeout',
    timeout: 10000,
    headers: {
        'Content-type': 'application/json'
    }
});

http.interceptors.request.use((configs) => {
    // const uId = localStorage.getItem('uId');
    // if(uId) {
    //     configs.headers = {
    //         uId
    //     }
    // }
    
    return configs;
});

http.interceptors.response.use(res => {
    if(res && res.data) return res.data;
    return res;
},err =>  err);

export default http;