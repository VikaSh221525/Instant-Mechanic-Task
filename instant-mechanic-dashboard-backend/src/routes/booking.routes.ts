import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";

const router = Router();

router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBookingById);
router.post("/", bookingController.createBooking);
router.patch("/:id/status", bookingController.updateBookingStatus);

export default router;
