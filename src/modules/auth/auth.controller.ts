import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signup(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
      });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const result = await authServices.signin(email, password);
    return res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: result,
      });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const authControllers = {
    signup,
    signin
}
