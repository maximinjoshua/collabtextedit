// src/api/axiosClient.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/', // adjust if your backend runs elsewhere
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global GET function
export const get = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('GET error:', error);
    throw error;
  }
};

// Global POST function
export const post = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    console.error('POST error:', error);
    throw error;
  }
};
