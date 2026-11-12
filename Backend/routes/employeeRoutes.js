
import express from "express";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Har employee route ke liye login zaroori hai.
router.use(protect);

// Admin aur HR Manager employee records manage kar sakte hain.
router
  .route("/")
  .get(authorize("admin", "hr"), getEmployees)
  .post(authorize("admin", "hr"), createEmployee);

router
  .route("/:id")
  .get(authorize("admin", "hr"), getEmployeeById)
  .patch(authorize("admin", "hr"), updateEmployee)
  .delete(authorize("admin"), deleteEmployee);

export default router;
