import axios from "axios";

const backend = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
  headers: { "X-Custom-Header": "foobar" },
});

export default backend;
