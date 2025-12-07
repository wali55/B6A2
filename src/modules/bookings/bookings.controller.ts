import { Request, Response } from "express";
import { bookingsServices } from "./bookings.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    if (customer_id !== (req.user as JwtPayload).id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Cannot create booking of other user!",
      });
    }

    const result = await bookingsServices.createBooking(req.body);
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.getAllBookings(
      req.user as JwtPayload
    );
    const msg =
      (req.user as JwtPayload).role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    return res.status(200).json({
      success: true,
      message: msg,
      data: result,
    });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    const result = await bookingsServices.updateBooking(
      bookingId as string,
      req.body.status,
      req.user as JwtPayload
    );

    const msg =
      (req.user as JwtPayload).role === "admin"
        ? "Booking marked as returned. Vehicle is now available"
        : "Booking cancelled successfully";

    res.status(200).json({
      success: true,
      message: msg,
      data: result,
    });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const bookingsControllers = {
  createBooking,
  getAllBookings,
  updateBooking,
};
