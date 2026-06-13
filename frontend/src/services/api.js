import axios from "axios";

const API = axios.create({

  baseURL: "https://ai-skill-gap-analyzer-backend.onrender.com",

});

export default API;
