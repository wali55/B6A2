import express from "express";
import { vehiclesControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin"), vehiclesControllers.createVehicle);
router.get("/", vehiclesControllers.getAllVehicles);
router.get("/:vehicleId", vehiclesControllers.getVehicleById);
router.put("/:vehicleId", auth("admin"), vehiclesControllers.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehiclesControllers.deleteVehicle);

export default router;
