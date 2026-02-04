import axios from "axios";

const api = axios.create({
  baseURL: "https://todoassignmentalt.onrender.com", // Check your backend port!
  withCredentials: true, // CRITICAL: Allows cookies to be sent/received
});

export default api;
