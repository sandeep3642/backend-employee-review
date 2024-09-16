import { Route, Controller, Tags, Post, Body, Get, Query, Delete } from "tsoa";
import { IResponse } from "../utils/interfaces.util";
import { signToken, verifyHash } from "../utils/common.util";
import employeModel from "../models/employe.model";
import {
  deleteById,
  findAll,
  findOne,
  getAll,
  upsert,
} from "../helpers/db.helpers";
import logger from "../configs/logger.config";
import mongoose from "mongoose";
import {geminiAPI } from "../utils/gpt.util"; // You need to create a util to handle GPT API calls.
import feedbackModel from "../models/feedback.model";

@Tags("Employees")
@Route("api/employee")
export default class EmployeeController extends Controller {
  req: Request;
  res: Response;

  constructor(req: Request, res: Response) {
    super();
    this.req = req;
    this.res = res;
  }

  /**
   * Login manager
   */
  @Post("/login")
  public async login(
    @Body() request: { email: string; password: string }
  ): Promise<IResponse> {
    try {
      const { email, password } = request;
      let exists = await findOne(employeModel, { email: email, role: 1 });
      const isValid = await verifyHash(password, exists.password);
      if (!isValid) {
        throw new Error("INVAILD_PASSWORD");
      }
      let token = await signToken(exists._id, { role: exists.role });

      return {
        data: { token },
        error: "",
        message: "",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${err.message}`);
      return {
        data: null,
        error: err.message ? err.message : err,
        message: "",
        status: 400,
      };
    }
  }

  /**
   * Add a  employee
   */
  @Post("/addEmployee")
  public async addEmployee(
    @Body()
    request: {
      employeeName: string;
      email: string;
      employeeId: string;
      joiningDate: string;
    }
  ): Promise<IResponse> {
    try {
      const { employeeName, email, employeeId, joiningDate } = request;
      var payload: { [k: string]: any } = {};
      let saveResponse;
      let existEmail = await findOne(employeModel, { email });
      if (existEmail) {
        throw new Error("Email is Already Exist ");
      }
      let existEmployeeId = await findOne(employeModel, { employeeId });
      if (existEmployeeId) {
        throw new Error("EmployeeId  is Already Exist ");
      }
      if (employeeName) {
        payload.employeeName = employeeName;
      }
      if (email) {
        payload.email = email;
      }
      if (employeeId) {
        payload.employeeId = employeeId;
      }
      if (joiningDate) {
        payload.joiningDate = joiningDate;
      }
      saveResponse = await upsert(employeModel, payload);
      return {
        data: { saveResponse },
        error: "",
        message: "",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${err.message}`);
      return {
        data: null,
        error: err.message ? err.message : err,
        message: "",
        status: 400,
      };
    }
  }

  /**
   * update a  employee
   */
  @Post("/update")
  public async update(
    @Body()
    request: {
      id: string;
      employeeName: string;
      email: string;
      joiningDate: string;
    }
  ): Promise<IResponse> {
    try {
      const { id, employeeName, email, joiningDate } = request;
      var payload: { [k: string]: any } = {};
      let saveResponse;
      let employee = await findOne(employeModel, { _id: id });
      if (employeeName) {
        payload.employeeName = employeeName;
      }
      if (email) {
        payload.email = email;
        let existEmail = await findOne(employeModel, { email });
        if (existEmail) {
          throw new Error("Email is Already Exist ");
        }
      }

      if (joiningDate) {
        payload.joiningDate = joiningDate;
      }

      saveResponse = await upsert(employeModel, payload, employee._id);
      return {
        data: { saveResponse },
        error: "",
        message: "",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${err.message}`);
      return {
        data: null,
        error: err.message ? err.message : err,
        message: "",
        status: 400,
      };
    }
  }

  /**
   * update a  employee
   */
  @Get("/getEmployebyId")
  public async getEmployebyId(@Query() id: string): Promise<IResponse> {
    try {
      const employeeFeedback = await employeModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id), // Match the employee by ID
          },
        },
        {
          $lookup: {
            from: "feedbacks", // The name of the feedback collection (make sure it's correct in your DB)
            localField: "_id", // The employee ID in the employee model
            foreignField: "employee", // The employee ObjectId in the feedback model
            as: "feedbacks", // The array of feedbacks that will be added to the result
          },
        },
        {
          $project: {
            email:1,  
            _id: 1,
            employeeName: 1, // Assuming you have a name field in the employee schema
            employeeId: 1,
            joiningDate:1,// Include the feedbacks array
            feedbacks: 1, 
          },
        },
      ]);
  
      if (!employeeFeedback || employeeFeedback.length === 0) {
        throw new Error("Employee not found");
      }
  
      return {
        data: employeeFeedback[0], // Since aggregation returns an array
        error: "",
        message: "",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${err.message}`);
      return {
        data: null,
        error: err.message ? err.message : err,
        message: "",
        status: 400,
      };
    }
  }
  

  /**
   * Get all user, require admin token
   */
  @Get("/getAllEmployee")
  public async getAllEmployee(): Promise<IResponse> {
    try {
      const getAllresponse = await findAll(employeModel, {
        userType: "employee",
      });

      return {
        data: getAllresponse,
        error: "",
        message: "All Employee get successfully",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${err.message}`);
      return {
        data: null,
        error: err.message ? err.message : err,
        message: "",
        status: 400,
      };
    }
  }

  @Delete("/delete")
  public async delete(@Query() id: string): Promise<IResponse> {
    try {
      const deleted = await deleteById(employeModel, id);
      if (!deleted) {
        throw new Error("INVALID_DOCUMENT");
      }
      return {
        data: deleted,
        error: "",
        message: "DELETE_SUCCESSFULLY",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${err.message}`);
      return {
        data: null,
        error: err.message ? err.message : err,
        message: "",
        status: 400,
      };
    }
  }

  @Post("/generateFeedback")
  public async generateFeedback(
    @Body()
    request: {
      employeeId: string;
      periodFrom: string;
      periodTo: string;
      metrics: {
        productivity: number;
        teamwork: number;
        punctuality: number;
        communication: number;
        problemSolving: number;
      };
    }
  ): Promise<IResponse> {
    try {
      const { employeeId, periodFrom, periodTo, metrics } = request;
  
      // Fetch the employee data
      const employee = await findOne(employeModel, {
        _id: new mongoose.Types.ObjectId(employeeId),
      });
      if (!employee) {
        throw new Error("Employee not found");
      }
  
      // Check if feedback for the same employeeId, periodFrom, and periodTo already exists
      const existingFeedback = await findOne(feedbackModel, {
        employeeId: employee.employeeId,
        periodFrom,
        periodTo,
      });
      if (existingFeedback) {
        throw new Error("Feedback for this period already exists");
      }
  
      // Generate feedback using geminiAPI
      const feedback = await geminiAPI(employee.employeeName,metrics);
  
      // Save feedback to the feedback collection
      const feedbackResponse = await upsert(feedbackModel, {
        employee: employee._id,
        employeeId: employee.employeeId,
        periodFrom,
        periodTo,
        metrics,
        feedback,
      });
  
      return {
        data: feedbackResponse,
        error: "",
        message: "Feedback updated successfully",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${err.message}`);
      return {
        data: null,
        error: err.message || err,
        message: "",
        status: 400,
      };
    }
  }
  
}
