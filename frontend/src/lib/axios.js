import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // this one send the cookies with the request
});
