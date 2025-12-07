import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `
        SELECT * FROM users
    `
  );

  result.rows.forEach((user) => delete user.password);
  return result;
};

const updateUser = async (id: string, user: Record<string, unknown>) => {
  const { name, email, phone, role } = user;
  const result = await pool.query(
    `
      UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *
    `,
    [name, email, phone, role, id]
  );

  delete result.rows[0].password;
  return result;
};


const deleteUser = async (id: string) => {
  const bookings = await pool.query(`SELECT status FROM bookings WHERE customer_id=$1`, [id]);
  const hasActiveBooking = bookings.rows.some((booking) => booking.status === "active");

  if (hasActiveBooking) {
    throw new Error("Cannot delete user because he/she has active booking!");
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};



export const usersServices = {
  getAllUsers,
  updateUser,
  deleteUser
};
