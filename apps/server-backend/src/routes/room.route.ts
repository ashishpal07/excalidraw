import express, { Router } from "express";
import { createRoom } from "../controllers/room.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/create", authenticate, createRoom);

export default router;
