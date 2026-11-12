
import mongoose from "mongoose";
import Employee from "../models/Employee.js";

// Sirf allowed fields ko request body se accept karna.
const getEmployeeData = (body) => ({
  employeeId: body.employeeId,
  personalDetails: {
    firstName: body.personalDetails?.firstName,
    lastName: body.personalDetails?.lastName,
    email: body.personalDetails?.email,
    phone: body.personalDetails?.phone,
    dateOfBirth: body.personalDetails?.dateOfBirth,
    gender: body.personalDetails?.gender,
    address: body.personalDetails?.address,
    city: body.personalDetails?.city,
    profileImage: body.personalDetails?.profileImage,
  },
  employmentDetails: {
    joiningDate: body.employmentDetails?.joiningDate,
    employmentType: body.employmentDetails?.employmentType,
    employmentStatus: body.employmentDetails?.employmentStatus,
    department: body.employmentDetails?.department || null,
    designation: body.employmentDetails?.designation,
    reportingManager: body.employmentDetails?.reportingManager || null,
  },
  emergencyContact: {
    name: body.emergencyContact?.name,
    relationship: body.emergencyContact?.relationship,
    phone: body.emergencyContact?.phone,
  },
});

// CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
  try {
    const data = getEmployeeData(req.body);

    const requiredFields = [
      data.employeeId,
      data.personalDetails.firstName,
      data.personalDetails.lastName,
      data.personalDetails.email,
      data.personalDetails.phone,
      data.employmentDetails.joiningDate,
      data.employmentDetails.designation,
    ];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required employee fields.",
      });
    }

    const employee = await Employee.create({
      ...data,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      status: "success",
      message: "Employee created successfully.",
      data: employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "Employee ID or email already exists.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to create employee.",
    });
  }
};

// GET ALL EMPLOYEES: Search, filters and pagination
export const getEmployees = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100
    );

    const { search, department, status, employmentType } = req.query;

    const filter = {};

    if (search?.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(safeSearch, "i");

      filter.$or = [
        { employeeId: searchRegex },
        { "personalDetails.firstName": searchRegex },
        { "personalDetails.lastName": searchRegex },
        { "personalDetails.email": searchRegex },
        { "personalDetails.phone": searchRegex },
      ];
    }

    if (department) {
      if (!mongoose.isValidObjectId(department)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid department ID.",
        });
      }

      filter["employmentDetails.department"] = department;
    }

    if (status) {
      filter["employmentDetails.employmentStatus"] = status;
    }

    if (employmentType) {
      filter["employmentDetails.employmentType"] = employmentType;
    }

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .populate("employmentDetails.department", "name")
        .populate("employmentDetails.reportingManager", "employeeId personalDetails.firstName personalDetails.lastName")
        .populate("createdBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Employee.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      results: employees.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch employees.",
    });
  }
};

// GET SINGLE EMPLOYEE PROFILE
export const getEmployeeById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid employee ID.",
      });
    }

    const employee = await Employee.findById(req.params.id)
      .populate("employmentDetails.department", "name")
      .populate("employmentDetails.reportingManager", "employeeId personalDetails.firstName personalDetails.lastName")
      .populate("createdBy", "fullName email")
      .populate("updatedBy", "fullName email");

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch employee profile.",
    });
  }
};

// UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid employee ID.",
      });
    }

    const data = getEmployeeData(req.body);

    // Undefined fields remove kar do, taake partial update possible ho.
    const updates = {};

    if (data.employeeId !== undefined) {
      updates.employeeId = data.employeeId;
    }

    for (const [section, fields] of Object.entries(data)) {
      if (section === "employeeId") continue;

      for (const [field, value] of Object.entries(fields || {})) {
        if (value !== undefined) {
          updates[`${section}.${field}`] = value;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No valid fields provided for update.",
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...updates,
          updatedBy: req.user._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Employee updated successfully.",
      data: employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "Employee ID or email already exists.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to update employee.",
    });
  }
};

// DELETE EMPLOYEE: Soft delete by changing employment status
export const deleteEmployee = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid employee ID.",
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "employmentDetails.employmentStatus": "terminated",
          updatedBy: req.user._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Employee marked as terminated.",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to delete employee.",
    });
  }
};
