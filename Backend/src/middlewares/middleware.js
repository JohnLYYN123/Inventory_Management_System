//const { off } = require("../server");

// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

function isAllWhitespace(str) {
  return /^[\s]*$/.test(str);
  //return str.trim().length === 0;
}
function isNumber(str) {
  return /^[+-]?\d+(\.\d+)?$/.test(str);
}

function isFloat(num) {
  return Number(num) === num && !Number.isInteger(num);
}

// Validate query parameters for inventory
const validateInventoryQueryParams = (req, res, next) => {
  if (req.query.status) {
    if (req.query.status !== "Available" && req.query.status !== "Pending" && req.query.status !== "Retried" && req.query.status !== "Unavailable") {
      return res.status(400).json({ error: "Invalid status. Allowed values are 'Available', 'Pending', 'Retried', 'Unavailable'." });
    }
  }
  if (req.query.deviceTypeId) {
    req.query.deviceTypeId = parseInt(req.query.deviceTypeId);
  }
  if (req.query.deviceUserId) {
    req.query.deviceUserId = parseInt(req.query.deviceUserId);
  }
  next();
};

const validateResourceId = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Resource ID is required" });
  }
  if (isNaN(id)) {
    return res.status(400).json({ error: "Resource ID must be a number" });
  }
  next();
};

const validateInventoryInput = (req) => {
  const { deviceName, status, deviceTypeId, deviceUserId } = req.body;
  const errors = [];

  if (!deviceName) {
    errors.push("Device name is required.");
  } else if (isAllWhitespace(deviceName)) {
    errors.push("Device name cannot be empty or whitespace.");
  }

  if (!status) {
    errors.push("Status is required.");
  } else if (status !== "Available" && status !== "Pending" && status !== "Retried" && status !== "Unavailable") {
    errors.push("Invalid status. Allowed values are 'Available', 'Pending', 'Retried', 'Unavailable'.");
  }

  if (deviceTypeId === undefined || isNaN(deviceTypeId)) {
    errors.push("Valid deviceTypeId is required.");
  } else {
    req.body.deviceTypeId = parseInt(deviceTypeId);
  }

  // Optional validation for deviceUserId
  if (deviceUserId !== undefined && isNaN(deviceUserId)) {
    errors.push("deviceUserId must be a number if provided.");
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return [];
  }
};

const validateInventoryUpdateInput = (req, res, next) => {
  const { deviceName, deviceTypeId } = req.body;
  const errors = [];

  if (!deviceName) {
    errors.push("Device name is required.");
  } else if (typeof deviceName !== "string" || isAllWhitespace(deviceName)) {
    errors.push("Device name cannot be empty or whitespace.");
  }

  if (deviceTypeId === undefined || isNaN(deviceTypeId)) {
    errors.push("Valid deviceTypeId is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      message: "Validation failed"
    });
  }

  next();
};

const validateRetireInput = (req, res, next) => {
  const { adminId, comment } = req.body;
  const errors = [];

  if (adminId === undefined || isNaN(adminId)) {
    errors.push("Valid adminId is required.");
  }

  if (comment !== undefined && typeof comment !== "string") {
    errors.push("Comment must be a string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      message: "Validation failed",
    });
  }

  next();
};

const validateDeviceTypeInput = (req) => {
  const { deviceTypeName } = req.body;
  const errors = [];
  if (!deviceTypeName) {
    errors.push("Device type name is required.");
  } else if (isAllWhitespace(deviceTypeName)) {
    errors.push("Device type name cannot be empty or whitespace.");
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return [];
  }
};

const validateRequestQueryParams = (req, res, next) => {
  const { status, requestorId, deviceId } = req.query;
  const errors = [];

  if (status) {
    if (status !== "approved" && status !== "pending" && status !== "rejected") {
      errors.push("Invalid status. Allowed values are 'approved', 'pending', 'rejected'.");
    }
  }

  if (requestorId) {
    if (isNaN(requestorId)) {
      errors.push("Requestor ID must be a number.");
    }
  }

  if (deviceId) {
    if (isNaN(deviceId)) {
      errors.push("Device ID must be a number.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

const validateRequestInput = (req) => {
  const { requestorId, deviceId } = req.body;
  const errors = [];

  if (requestorId && !isNaN(requestorId)) {
    console.log("Requestor ID is", requestorId);
  } else {
    errors.push("Requestor ID must be a number.");
  }

  if (!deviceId) {
    errors.push("Device ID is required.");
  } else if (isNaN(deviceId)) {
    errors.push("Device ID must be a number.");
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return [];
  }
};

const validateUserInput = (req) => {
  const { userName, email, password, role } = req.body;
  const errors = [];

  if (!userName) {
    errors.push("Username is required.");
  } else if (isAllWhitespace(userName)) {
    errors.push("Username cannot be empty or whitespace.");
  }

  if (!password) {
    errors.push("Password is required.");
  } else if (isAllWhitespace(password)) {
    errors.push("Password cannot be empty or whitespace.");
  }

  if (!email) {
    errors.push("Email is required.");
  } else if (isAllWhitespace(email)) {
    errors.push("Email cannot be empty or whitespace.");
  }

  if (!role) {
    errors.push("Role is required.");
  } else if (role != "Admin" && role != "User") {
    errors.push("Role must be either 'Admin', 'Internal', or 'External'.");
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return [];
  }
};

const validateTransactionFilters = (req, res, next) => {
  const { activity, deviceId, executorId } = req.query;
  const errors = [];

  if (deviceId !== undefined && isNaN(deviceId)) {
    errors.push("deviceId must be a number.");
  }

  if (executorId !== undefined && isNaN(executorId)) {
    errors.push("executorId must be a number.");
  }

  if (activity !== undefined && typeof activity !== "string") {
    errors.push("activity must be a string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      message: "Invalid query parameters",
    });
  }

  next();
};

const validateReturnInput = (req, res, next) => {
  const { userId, comment } = req.body;
  const errors = [];

  if (userId === undefined || isNaN(userId)) {
    errors.push("Valid userId is required.");
  }

  if (comment !== undefined && typeof comment !== "string") {
    errors.push("Comment must be a string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      message: "Validation failed",
    });
  }

  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = {
  requestLogger,
  validateInventoryQueryParams,
  validateResourceId,
  validateInventoryInput,
  validateInventoryUpdateInput,
  validateRetireInput,
  validateDeviceTypeInput,
  validateRequestQueryParams,
  validateRequestInput,
  validateUserInput,
  validateTransactionFilters,
  validateReturnInput,
  errorHandler
};