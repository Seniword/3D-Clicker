import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000/"
})
if(localStorage.getItem('jwtToken')) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwtToken')}`;
}

export default instance;