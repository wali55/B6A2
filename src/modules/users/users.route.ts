import express from "express";
import { usersControllers } from "./users.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin"), usersControllers.getAllUsers);
router.put("/:userId", auth("admin", "customer"), usersControllers.updateUser);
router.delete("/:userId", auth("admin"), usersControllers.deleteUser);

export default router;