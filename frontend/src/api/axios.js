import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})
//i am using axios for api calling in whole frontend 

API.interceptors.request.use((config) => {//this is for jwt authenctication it authenticate user via token 
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default API