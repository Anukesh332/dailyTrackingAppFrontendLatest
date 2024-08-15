import axios from "axios";

const URL = process.env.REACT_APP_DAILY_TRACKING_APP_PRODUCT_API;

export async function addProduct(obj) {
    const headers = {
        "auth-token": sessionStorage.getItem('token')
    }
    let url = `${URL}/addProduct`;
    let response = await axios.post(url, obj, { headers }).catch((err) => {
        console.log(err)
    });
    return response;
}

export async function uploadProductImg(formData) {
    const headers = {
        "Content-Type": 'multipart/form-data'
    }
    let url = `${URL}/upload`;
    let response = await axios.post(url, formData, { headers }).catch((err) => {
        console.log(err)
    });
    return response;
};

export async function getAllSellerProducts() {
    const headers = {
        "auth-token": sessionStorage.getItem('token')
    }
    let url = `${URL}/getAllSellerProducts`;
    let response = await axios.get(url, { headers }).catch((err) => {
        console.log(err)
    });
    return response;
}

export async function deleteProduct(obj) {
    const headers = {
        "auth-token": sessionStorage.getItem('token')
    }
    let url = `${URL}/deleteProduct`;
    let response = await axios.post(url, obj, { headers }).catch((err) => {
        console.log(err)
    });
    return response;
};

export async function deleteUploadProductImg(img) {
    const headers = {
        "Content-Type": 'multipart/form-data'
    }
    let url = `${URL}/imageDelete/${img}`;
    let response = await axios.delete(url, { headers }).catch((err) => {
        console.log(err)
    });
    return response;
};

export async function getAllProducts() {
    const headers = {
        "auth-token": sessionStorage.getItem('token')
    }
    let url = `${URL}/getAllProducts`;
    let response = await axios.get(url, { headers }).catch((err) => {
        console.log(err)
    });
    return response;
};

export async function getAllProductsNoUser() {
    let url = `${URL}/getAllProductsNoUser`;
    let response = await axios.get(url).catch((err) => {
        console.log(err)
    });
    return response;
};