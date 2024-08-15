import axios from "axios";

const URL = process.env.REACT_APP_DAILY_TRACKING_APP_ADDTOCART_API;

export async function addToCart(obj) {
  const headers = {
    "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/addToCart`;
  let response = await axios.post(url, obj, { headers }).catch((err) => {
    console.log(err)
  });;
  return response;
};

export async function getAllCartProducts() {
  const headers = {
    "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/getAllCartProducts`;
  let response = await axios.get(url, { headers }).catch((err) => {
    console.log(err)
  });
  return response;
};

export async function deleteCartData(obj) {
  const headers = {
      "auth-token": sessionStorage.getItem('token')
  }
  let url = `${URL}/deleteCartData`;
  let response = await axios.post(url, obj, { headers }).catch((err) => {
      console.log(err)
  });
  return response;
};