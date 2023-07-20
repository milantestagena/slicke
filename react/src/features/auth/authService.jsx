import axios from "axios";
import axiosClient from "../../axios-client"
const API_URL = "http://localhost:8000/api/signup";


// register user

const register= async (userData) => {
  const response = await axiosClient.post(API_URL, userData)
   console.log(response)
  if (response.data){
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data

}

const authService = {
  register,
}

export default authService
