import axios from "axios"
// import { HOST } from "@/utils/constans.js"

export const apiClient = axios.create({
    baseURL: "https://mychatapp-47h3.onrender.com",
    // baseURL: import.meta.env.MODE === "development" ? HOST : "https://mychatapp-47h3.onrender.com",
})