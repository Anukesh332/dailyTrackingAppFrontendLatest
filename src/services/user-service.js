import axios from "axios";

const URL = process.env.REACT_APP_DAILY_TRACKING_APP_USER_API;

export async function authenticate(login) {
     let url = `${URL}/authenticateUser`;
     let response = await axios.post(url, login);
     return response;
  }

  export async function fetchUser() {
    const headers = {
      "auth-token": sessionStorage.getItem('token')
    }
    let url = `${URL}/fetchUser`;
    let response = await axios.post(url, {}, {headers}).catch((err) => {
      console.log(err)
  });;
    return response;
 }

 export async function addUser(userBody) {
  let url = `${URL}/addUser`;
  let response = await axios.post(url, userBody);
  return response;
}