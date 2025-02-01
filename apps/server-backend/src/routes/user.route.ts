import express, { Router } from "express";
import { create, deleteUser, getUser, loginUser } from "../controllers/user.controller";

const router: Router = express.Router();

router.post("/register", create);

router.post("login", loginUser);

router.get("/:userId", getUser);

router.delete("/:userId", deleteUser);

export default router;
