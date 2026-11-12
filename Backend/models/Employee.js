
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: "other",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    personalDetails: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      address: String,
      city: String,
      profileImage: String,
    },

    employmentDetails: {
      joiningDate: {
        type: Date,
        required: true,
      },
      employmentType: {
        type: String,
        enum: ["full-time", "part-time", "contract", "intern"],
        default: "full-time",
      },
      employmentStatus: {
        type: String,
        enum: ["active", "inactive", "terminated", "on-leave"],
        default: "active",
      },
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null,
      },
      designation: {
        type: String,
        required: true,
        trim: true,
      },
      reportingManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
      },
    },

    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    documents: [documentSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate employee email addresses.
employeeSchema.index(
  { "personalDetails.email": 1 },
  { unique: true }
);

// Useful for employee directory filters.
employeeSchema.index({
  "employmentDetails.department": 1,
  "employmentDetails.employmentStatus": 1,
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
