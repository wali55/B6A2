import express from "express";
import { bookingsControllers } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingsControllers.createBooking);
router.get("/", auth("admin", "customer"), bookingsControllers.getAllBookings);
router.put("/:bookingId", auth("admin", "customer"), bookingsControllers.updateBooking);

export default router;