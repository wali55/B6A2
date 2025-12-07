import { pool } from "../../config/db";
import { formatToLocalYMD } from "../../config/utils";

const createBooking = async (booking: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = booking;

  const vehicleQuery = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status from vehicles WHERE id=$1`,
    [vehicle_id]
  );
  const vehicle = vehicleQuery.rows[0];
  if (vehicle.availability_status === "booked") {
    throw new Error("This vehicle is already booked!");
  }

  delete vehicle.availability_status;

  const endDate = new Date(rent_end_date as string);
  const startDate = new Date(rent_start_date as string);
  const subtract = endDate.getTime() - startDate.getTime();

  const totalRentDays = Math.round(subtract / (1000 * 60 * 60 * 24));
  const totalPrice = totalRentDays * vehicle.daily_rent_price;

  const result = await pool.query(
    `
        INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, "total_price") VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
    ["booked", vehicle_id]
  );

  result.rows[0].rent_start_date = formatToLocalYMD(
    result.rows[0].rent_start_date
  );
  result.rows[0].rent_end_date = formatToLocalYMD(result.rows[0].rent_end_date);

  return { ...result.rows[0], vehicle };
};

const getAllBookings = async (user: Record<string, unknown>) => {
  if (user.role === "admin") {
    const AdminResult = await pool.query(`SELECT * FROM bookings`);

    const updatedAdminResult = await Promise.all(
      AdminResult.rows.map(async (booking) => {
        const customerQuery = await pool.query(
          `SELECT name, email FROM users WHERE id=$1`,
          [booking.customer_id]
        );

        const vehicleQuery = await pool.query(
          `SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1`,
          [booking.vehicle_id]
        );

        booking.rent_start_date = formatToLocalYMD(booking.rent_start_date);
        booking.rent_end_date = formatToLocalYMD(booking.rent_end_date);

        return {
          ...booking,
          customer: customerQuery.rows[0],
          vehicle: vehicleQuery.rows[0],
        };
      })
    );

    return updatedAdminResult;
  } else {
    const CustomerResult = await pool.query(
      `
        SELECT id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings WHERE customer_id=$1
    `,
      [user.id]
    );

    const updatedCustomerResult = await Promise.all(
      CustomerResult.rows.map(async (booking) => {
        const vehicleQuery = await pool.query(
          `SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1`,
          [booking.vehicle_id]
        );

        booking.rent_start_date = formatToLocalYMD(booking.rent_start_date);
        booking.rent_end_date = formatToLocalYMD(booking.rent_end_date);

        return { ...booking, vehicle: vehicleQuery.rows[0] };
      })
    );
    return updatedCustomerResult;
  }
};

const updateBooking = async (
  id: string,
  status: string,
  user: Record<string, unknown>
) => {
  if (user.role === "admin") {
    const adminResult = await pool.query(
      `
      UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
    `,
      [status, id]
    );

    const vehicle = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", adminResult.rows[0].vehicle_id]
    );

    adminResult.rows[0].rent_start_date = formatToLocalYMD(
      adminResult.rows[0].rent_start_date
    );
    adminResult.rows[0].rent_end_date = formatToLocalYMD(
      adminResult.rows[0].rent_end_date
    );
    return {...adminResult.rows[0], vehicle: vehicle.rows[0]};
  } else {
    
    const booking = await pool.query(
      `SELECT customer_id, rent_start_date FROM bookings WHERE id=$1`,
      [id]
    );

    if (new Date(booking.rows[0].rent_start_date).getTime() < Date.now()) {
      throw new Error("Cannot cancel the booking. Rent date already passed!");
    }


    if (Number(user.id) !== Number(booking.rows[0].customer_id)) {
      throw new Error("Cannot update other people's booking");
    }
    const customerResult = await pool.query(
      `
      UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
    `,
      [status, id]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", customerResult.rows[0].vehicle_id]
    );

    customerResult.rows[0].rent_start_date = formatToLocalYMD(
      customerResult.rows[0].rent_start_date
    );
    customerResult.rows[0].rent_end_date = formatToLocalYMD(
      customerResult.rows[0].rent_end_date
    );
    return customerResult.rows[0];
  }
};

export const bookingsServices = {
  createBooking,
  getAllBookings,
  updateBooking,
};
