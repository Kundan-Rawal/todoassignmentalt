import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/", // Check your backend port!
  withCredentials: true, // CRITICAL: Allows cookies to be sent/received
});

export default api;
