import axios from "axios";

// Create axios instance
const backend = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
  headers: { "X-Custom-Header": "foobar" },
});

// Function to set auth token for all future requests
export const setAuthToken = (token: any) => {
  console.log("Reached in instacne", token);
  if (token) {
    backend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete backend.defaults.headers.common["Authorization"];
  }
};

export default backend;
