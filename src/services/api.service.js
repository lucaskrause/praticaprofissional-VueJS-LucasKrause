import axios from 'axios'

const ApiService = {

    init(url) {
        axios.defaults.baseURL = url;

        axios.interceptors.response.use(response => {
            return response
        })
    },

    get(resource) {
        return axios.get(resource)
    },

    post(resource, data) {
        return axios.post(resource, data)
    },

    put(resource, data) {
        return axios.put(resource, data)
    },

    delete(resource) {
        return axios.delete(resource)
    }
};

export default ApiService