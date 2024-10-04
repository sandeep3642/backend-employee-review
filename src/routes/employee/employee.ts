import express, { Request, Response } from "express";
import { responseWithStatus } from "../../utils/response.util";
import EmployeeController from "../../controllers/employee.controller";
import { authenticateManager } from "../../middlewares/auth.middleware";

const router = express.Router();
router.post("/login", async (req: Request | any, res: Response | any) => {
  const { email, password } = req.body;
  const controller = new EmployeeController(req, res);
  const response = await controller.login({ email, password });
  const { status } = response;
  return responseWithStatus(res, status, response);
});

router.post("/addEmployee", async (req: Request | any, res: Response | any) => {
  const { employeeName, email, employeeId, joiningDate } = req.body;
  const controller = new EmployeeController(req, res);
  const response = await controller.addEmployee({
    employeeName,
    email,
    employeeId,
    joiningDate,
  });
  const { status } = response;
  return responseWithStatus(res, status, response);
});

router.post("/update", async (req: Request | any, res: Response | any) => {
  const { id, employeeName, email, joiningDate } = req.body;
  const controller = new EmployeeController(req, res);
  const response = await controller.update({
    id,
    employeeName,
    email,
    joiningDate,
  });
  const { status } = response;
  return responseWithStatus(res, status, response);
});

router.get(
  "/getEmployebyId",
  async (req: Request | any, res: Response | any) => {
    const { id } = req.query;
    const controller = new EmployeeController(req, res);
    const response = await controller.getEmployebyId(id);
    const { status } = response;
    return responseWithStatus(res, status, response);
  }
);

router.get(
  "/getAllEmployee",
  async (req: Request | any, res: Response | any) => {
    const controller = new EmployeeController(req, res);
    const response = await controller.getAllEmployee();
    const { status } = response;
    return responseWithStatus(res, status, response);
  }
);

router.delete("/delete", async (req: Request | any, res: Response | any) => {
  const { id } = req.query;
  const controller = new EmployeeController(req, res);
  const response = await controller.delete(id);
  const { status } = response;
  return responseWithStatus(res, status, response);
});

router.post(
  "/generateFeedback",
  authenticateManager,
  async (req: Request | any, res: Response | any) => {
    const { employeeId, periodFrom, periodTo, metrics } = req.body;
    const controller = new EmployeeController(req, res);
    const response = await controller.generateFeedback({
      employeeId,
      periodFrom,
      periodTo,
      metrics,
    });
    const { status } = response;
    return responseWithStatus(res, status, response);
  }
);

router.get(
  "/compareEmployeeFeedback",
  async (req: Request | any, res: Response | any) => {
    const { employee1Id, employee2Id } = req.query
    const controller = new EmployeeController(req, res);
    const response = await controller.compareEmployeeFeedback(employee1Id,employee2Id);
    const { status } = response;
    return responseWithStatus(res, status, response);
  }
);
module.exports = router;
