import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.databaseURL,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          email VARCHAR(200) UNIQUE NOT NULL,
          password VARCHAR(200) NOT NULL,
          phone VARCHAR(200) NOT NULL,
          role VARCHAR(50) NOT NULL,
          CHECK (email = LOWER(email)),
          CHECK (length(password) >= 6),
          CHECK (role IN ('admin', 'customer'))
        );
  `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(200) NOT NULL,
            type VARCHAR(50) NOT NULL,
            registration_number VARCHAR(200) UNIQUE NOT NULL,
            daily_rent_price INTEGER NOT NULL,
            availability_status VARCHAR(50) NOT NULL,
            CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            CHECK (daily_rent_price > 0),
            CHECK (availability_status IN ('available', 'booked'))
        );
  `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price INTEGER NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'active',
            CHECK (rent_end_date > rent_start_date),
            CHECK (total_price > 0),
            CHECK (status IN ('active', 'cancelled', 'returned'))
        );
  `);
};

export default initDB;
