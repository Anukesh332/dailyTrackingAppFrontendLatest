import axios from "axios";

const URL = process.env.REACT_APP_DAILY_TRACKING_APP_BUYPRODUCT_API;

export async function buyProduct(obj) {
  const headers = {
    "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/buyProduct`;
  let response = await axios.post(url, obj, { headers }).catch((err) => {
    console.log(err)
  });;
  return response;
};

export async function getDeliveryPendingProducts() {
  const headers = {
    "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/getDeliveryPendingProducts`;
  let response = await axios.get(url, { headers }).catch((err) => {
    console.log(err)
  });;
  return response;
};

export async function getDeliveredProducts() {
  const headers = {
    "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/getDeliveredProducts`;
  let response = await axios.get(url, { headers }).catch((err) => {
    console.log(err)
  });;
  return response;
};

export async function getDeliveredProductsGraph(filterDate) {
  const headers = {
    "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/getDeliveredProductsGraph`;
  let response = await axios.post(url, filterDate, { headers }).catch((err) => {
    console.log(err)
  });;
  return response;
};

export async function getMyOrder() {
  const headers = {
    "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/getMyOrder`;
  let response = await axios.get(url, { headers }).catch((err) => {
    console.log(err)
  });;
  return response;
};