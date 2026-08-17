import { Router } from "express";
import { requireOwnerAuth } from "../middleware/auth.js";
import { getAdminConfig, updateAdminConfig, getAdminLeads } from "../controllers/adminController.js";

const router = Router();
router.use(requireOwnerAuth);

router.get("/config", getAdminConfig);
router.put("/config", updateAdminConfig);
router.get("/leads", getAdminLeads);

export default router;
