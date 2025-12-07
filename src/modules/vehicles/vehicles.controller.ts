import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getAllVehicles();
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehiclesServices.getVehicleById(vehicleId as string);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    } else {
      res
        .status(200)
        .json({
          success: true,
          message: "Vehicle retrieved successfully",
          data: result.rows[0],
        });
    }
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json({ message: error?.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehiclesServices.updateVehicle(
      vehicleId as string,
      req.body
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found!" });
    } else {
      res
        .status(200)
        .json({
          success: true,
          message: "Vehicle updated successfully",
          data: result.rows[0],
        });
    }
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehiclesServices.deleteVehicle(vehicleId as string);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: "Vehicle not found" });
    } else {
      res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
    }
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json({ success: false, message: error?.message });
  }
}

export const vehiclesControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
