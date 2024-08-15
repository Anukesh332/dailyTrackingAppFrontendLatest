import axios from "axios";

axios.interceptors.response.use((response) => { // block to handle success case
    return response
}, function (error) { // block to handle error case
    // const originalRequest = error.config;
    console.log("error", error)
    if (error?.response?.data?.Message) {
        return Promise.reject(error.response.data.Message);
    }

    return Promise.reject("Unable to process request");
});