import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/common.util";
import { responseWithStatus } from "../utils/response.util";

export const authenticateManager = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const decoded: any = verifyToken(authHeader);
    if (decoded) {
      // @ts-ignore
      if (decoded?.role == 1) {
        req.body.user = decoded;
        next();
      } else {
        return responseWithStatus(res, 400, {
          data: null,
          error: "Session error, Please login again!",
          message: "",
          status: 400,
        });
      }
    } else {
      return responseWithStatus(res, 400, {
        data: null,
        error: "Session expired, Please login again!",
        message: "",
        status: 400,
      });
    }
  } else {
    return responseWithStatus(res, 400, {
      data: null,
      error: "Session not valid, Please login again!",
      message: "",
      status: 400,
    });
  }
};
