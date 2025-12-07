import { pool } from "../../config/db";

const createVehicle = async (vehicle: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicle;

  const result = await pool.query(
    `
        INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(
    `
        SELECT * FROM vehicles
    `
  );
  return result;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM vehicles WHERE id=$1
    `,
    [id]
  );
  return result;
};

const updateVehicle = async (id: string, vehicle: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicle;
  const result = await pool.query(
    `
      UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};

const deleteVehicle = async (id: string) => {
  const bookings = await pool.query(`SELECT status FROM bookings WHERE vehicle_id=$1`, [id]);
  const hasActiveBooking = bookings.rows.some((booking) => booking.status === "active");

  if (hasActiveBooking) {
    throw new Error("Cannot delete vehicle because it has active booking!");
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return result;
} 

export const vehiclesServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
