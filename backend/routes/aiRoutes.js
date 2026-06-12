import express from "express";
import { getATSStructure } from "../controllers/aiController.js";
import { analyzeResumeWithAI,} from "../controllers/aiController.js";


const router = express.Router();


// AI Analysis Route
router.post( "/analyze",analyzeResumeWithAI);
// ATS Parsing Route
router.post("/ats-parse", getATSStructure);


export default router;