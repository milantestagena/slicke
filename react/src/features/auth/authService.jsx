import axios from "axios";

const API_URL = "http://localhost:8000/api/signup";

// register user

const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data){
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    localStorage.setItem('token', JSON.stringify(response.data.data.token))
    localStorage.setItem("response", JSON.stringify(response.data));
    
  }

  return response.data
}

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token')
}

const authService = {
  register,
  logout,
}

export default authService