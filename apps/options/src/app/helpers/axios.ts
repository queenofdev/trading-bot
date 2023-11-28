import axios from "axios";
import { Backend_API } from "../core/constants/basic";

export const backendInstance = axios.create({
  baseURL: Backend_API,
});
