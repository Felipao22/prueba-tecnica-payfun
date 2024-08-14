import axios from "axios";

const apiBaseUrl = "http://localhost:3001/payment_single";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export default apiClient;
