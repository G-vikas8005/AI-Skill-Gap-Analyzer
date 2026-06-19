import axios from "axios";

// const API = axios.create({

//   baseURL: "https://ai-skill-gap-analyzer-backend.onrender.com",

// });
const API = axios.create({
  baseURL: "https://ai-skill-gap-analyzer-backend.onrender.com/api",
});

export default API;
