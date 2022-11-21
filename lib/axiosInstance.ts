import axios, { AxiosInstance } from "axios";

const server: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default server;
