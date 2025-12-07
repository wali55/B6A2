import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signup = async (user: Record<string, unknown>) => {
  const { name, email, password, phone, role } = user;
  const hashed = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [name, email, hashed, phone, role]
  );
  delete result.rows[0].password;

  return result;
};

const signin = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  
  if (result.rows.length === 0) {
    throw new Error("Could not find the user!");
  }

  const user = result.rows[0];
  
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials!");
  }

  delete user.password;

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  return { token, user };
};

export const authServices = {
  signup,
  signin
};
