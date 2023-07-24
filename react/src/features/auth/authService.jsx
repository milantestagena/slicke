import axios from "axios";
import axiosClient from "../../axios-client";

const API_URL = "http://localhost:8000/api/";

// register user

const register = async (userData) => {
  const response = await axiosClient.post(API_URL+'signup', userData)

  if (response.data){
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('token', response.data.data.token);
  }

  return response.data
}

const login = async (userData) => {
  const response = await axiosClient.post(API_URL+'login', userData)

  if (response.data){
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('token', response.data.data.token);
  }

  return response.data
}

const logout = async () => {
  const response = await axiosClient.post(API_URL+'logout')
  localStorage.removeItem('user');
  localStorage.removeItem('token')
}

const authService = {
  register,
  login,
  logout,
}

export default authService
