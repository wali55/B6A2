import { Request, Response } from "express";
import { usersServices } from "./users.service";
import { JwtPayload } from "jsonwebtoken";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (
      Number(userId) !== (req.user as JwtPayload).id &&
      (req.user as JwtPayload).role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized. Cannot update the user!",
        });
    }

    const result = await usersServices.updateUser(userId as string, req.body);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await usersServices.deleteUser(userId as string);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({ success: true, message: "User deleted successfully" });
    }
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json({ success: false, message: error?.message });
  }
}

export const usersControllers = {
  getAllUsers,
  updateUser,
  deleteUser
};
