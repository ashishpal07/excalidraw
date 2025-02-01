import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const headers = req.headers["authorization"] || "";
    const token = headers.split(" ")[1] || "";
    if (!token) {
      res.status(401).json({ message: "Token Not Provided." });
      return;
    }

    const decode = jwt.verify(token, "rendom_secret_key");
    if (!decode) {
      res.status(401).json({ message: "Unauthorized." })
      return;
    }

    req.user = (decode as {user: any}).user;
    next();

  } catch (error) {
    res.status(401).json({ message: "Unauthorised" });
  }
}
