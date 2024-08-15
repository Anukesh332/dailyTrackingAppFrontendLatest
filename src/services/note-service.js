import axios from "axios";

const URL = process.env.REACT_APP_DAILY_TRACKING_APP_NOTE_API;

export async function getUserNotes() {
   const headers = {
      "auth-token": sessionStorage.getItem('token')
    }
    let url = `${URL}/getUserNotes`;
    let response = await axios.get(url, {headers}).catch((err) => {
      console.log(err)
    });;
    return response;
  }

  export async function addNote(obj) {
    const headers = {
       "auth-token": sessionStorage.getItem('token')
     }
     let url = `${URL}/addNote`;
     let response = await axios.post(url, obj, {headers}).catch((err) => {
       console.log(err)
     });;
     return response;
   }

   export async function deleteNote(obj) {
    const headers = {
       "auth-token": sessionStorage.getItem('token')
     }
     let url = `${URL}/deleteNote`;
     let response = await axios.post(url, obj, {headers}).catch((err) => {
       console.log(err)
     });;
     return response;
   }