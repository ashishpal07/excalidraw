import express, { Router } from "express";
import userRoutes from "./user.route";
import roomRoutes from "./room.route";

const router: Router = express.Router();

router.use("api/v1/users", userRoutes);

router.use("api/v1/rooms", roomRoutes);

export default router;
