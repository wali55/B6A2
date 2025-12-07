import express, { Request, Response } from "express";
import initDB from "./config/db";
import authRouter from "./modules/auth/auth.route";
import vehiclesRouter from "./modules/vehicles/vehicles.route";
import usersRouter from "./modules/users/users.route";
import bookingsRouter from "./modules/bookings/bookings.route"

const app = express();

initDB();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({success: true, message: "Hello World"});
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehiclesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/bookings", bookingsRouter);

export default app;