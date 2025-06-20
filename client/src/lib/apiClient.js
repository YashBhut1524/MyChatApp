import axios from "axios"
import { HOST } from "@/utils/constans.js"

export const apiClient = axios.create({
    baseURL: import.meta.env.MODE === "development" ? HOST : "/"
})