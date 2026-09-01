import { Booking } from "../models/Booking";
import { Mechanic } from "../models/Mechanic";
import { BookingStatus, MechanicStatus, BOOKING_STATUS_TRANSITIONS } from "../types";
import { emitBookingUpdated } from "../sockets/booking.socket";
import { env } from "../config/env";

let intervalHandle: NodeJS.Timeout | null = null;

/**
 * Advances in-flight bookings through their lifecycle and emits Socket.IO
 * events to keep the dashboard feeling live in real-time.
 */
async function tick() {
  try {
    // 1. Find in-flight bookings (PENDING, ASSIGNED, ON_THE_WAY)
    const inFlight = await Booking.find({
      status: {
        $in: [BookingStatus.PENDING, BookingStatus.ASSIGNED, BookingStatus.ON_THE_WAY],
      },
    })
      .sort({ updatedAt: 1 })
      .limit(10);

    if (inFlight.length === 0) {
      return;
    }

    // Pick 1-2 random in-flight bookings to advance this tick
    const countToAdvance = Math.min(inFlight.length, Math.floor(Math.random() * 2) + 1);
    const shuffled = inFlight.sort(() => 0.5 - Math.random()).slice(0, countToAdvance);

    for (const booking of shuffled) {
      const nextOptions = BOOKING_STATUS_TRANSITIONS[booking.status].filter(
        (s) => s !== BookingStatus.CANCELLED
      );
      if (nextOptions.length === 0) continue;

      const nextStatus = nextOptions[0];
      const oldStatus = booking.status;

      // When moving PENDING -> ASSIGNED, assign a mechanic
      if (nextStatus === BookingStatus.ASSIGNED) {
        let mechanic = await Mechanic.findOne({
          status: MechanicStatus.AVAILABLE,
        });

        // Fallback: if no available mechanic, pick any active mechanic
        if (!mechanic) {
          mechanic = await Mechanic.findOne({
            status: { $ne: MechanicStatus.OFFLINE },
          });
        }

        if (mechanic) {
          booking.mechanic = mechanic._id;
          mechanic.status = MechanicStatus.BUSY;
          await mechanic.save();
        }
      }

      booking.status = nextStatus;
      booking.statusHistory.push({ status: nextStatus, changedAt: new Date() });
      await booking.save();

      // When completing, free the mechanic and increment job count
      if (nextStatus === BookingStatus.COMPLETED && booking.mechanic) {
        await Mechanic.findByIdAndUpdate(booking.mechanic, {
          status: MechanicStatus.AVAILABLE,
          $inc: { jobsCompleted: 1 },
        });
      }

      emitBookingUpdated({
        bookingId: booking.bookingId,
        oldStatus,
        newStatus: nextStatus,
        mechanicId: booking.mechanic?.toString() ?? null,
        updatedAt: new Date().toISOString(),
      });
      console.log(`[simulation] ${booking.bookingId}: ${oldStatus} -> ${nextStatus}`);
    }
  } catch (error) {
    console.error("[simulation] tick failed:", error);
  }
}

export function startSimulation() {
  if (!env.enableLiveSimulation || intervalHandle) return;
  console.log(
    `[simulation] live booking simulation enabled (every ${env.simulationIntervalMs}ms)`
  );
  intervalHandle = setInterval(tick, env.simulationIntervalMs);
}

export function stopSimulation() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}
