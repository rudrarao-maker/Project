const { body } = require("express-validator");

const applicationValidator = [
  body("serviceId")
    .notEmpty()
    .withMessage("Service ID is required")
    .isInt({ min: 1 })
    .withMessage("Invalid service ID"),
  body("data")
    .optional()
    .isObject()
    .withMessage("Application data must be an object"),
];

const updateApplicationValidator = [
  body("status")
    .optional()
    .isIn(["pending", "in_progress", "approved", "rejected", "on_hold"])
    .withMessage("Invalid status"),
  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Remarks must be under 1000 characters"),
];

module.exports = { applicationValidator, updateApplicationValidator };
