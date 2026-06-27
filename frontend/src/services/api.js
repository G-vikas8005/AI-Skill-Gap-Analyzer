import axios from "axios";


const API = axios.create({
   baseURL: "https://ai-skill-gap-analyzer-backend.onrender.com/api",
   //baseURL: "http://localhost:5000/api",
});

export default API;
