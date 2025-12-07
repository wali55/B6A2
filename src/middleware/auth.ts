import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenStr = req.headers.authorization;
      const token = tokenStr?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Missing or invalid authentication token",
          });
      }

      const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({success: false, message: "Forbidden. Insufficient permissions!"})
      }
      next();
    } catch (error: any) {
      console.log(error?.message);
      return res.status(500).json({ success: false, message: error?.message });
    }
  };
};

export default auth;
