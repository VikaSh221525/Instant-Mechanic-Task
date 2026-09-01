import { Router } from "express";
import * as mechanicController from "../controllers/mechanic.controller";

const router = Router();

router.get("/", mechanicController.getMechanics);
router.get("/:id", mechanicController.getMechanicById);

export default router;
