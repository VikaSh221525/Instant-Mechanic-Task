import { Router } from "express";
import dashboardRoutes from "./dashboard.routes";
import bookingRoutes from "./booking.routes";
import mechanicRoutes from "./mechanic.routes";
import customerRoutes from "./customer.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ success: true, message: "Instant Mechanic Dashboard API", version: "1.0.0" });
});

router.use("/dashboard", dashboardRoutes);
router.use("/bookings", bookingRoutes);
router.use("/mechanics", mechanicRoutes);
router.use("/customers", customerRoutes);

export default router;
