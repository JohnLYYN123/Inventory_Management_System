const { off } = require("../server");

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
  const { deviceName, status, deviceTypeId } = req.body;
  const errors = [];

  if (!deviceName) {
    errors.push("Device name is required.");
  } else if (isAllWhitespace(deviceName)) {
    errors.push("Device name cannot be empty or whitespace.");
  }

  if (!status) {
    errors.push("Status is required.");
  } else if (isAllWhitespace(status)) {
    errors.push("Status cannot be empty or whitespace.");
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return [];
  }
}

const validateDeviceTypeInput = (req) => {
  const { deviceType } = req.body;
  const errors = [];
  if (!deviceType) {
    errors.push("Device type is required.");
  } else if (isAllWhitespace(deviceType)) {
    errors.push("Device type cannot be empty or whitespace.");
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return [];
  }
}

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
}

const validateRequestInput = (req) => {
  const { status, requestorId, deviceId, adminComment, requestDetail } = req.body;
  const errors = [];

  if (!status) {
    errors.push("Status is required.");
  } else if (status !== "approved" && status !== "pending" && status !== "rejected") {
    errors.push("Invalid status. Allowed values are 'approved', 'pending', 'rejected'.");
  }

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

  if (adminComment) {
    if (isAllWhitespace(adminComment)) {
      errors.push("Admin comment cannot be empty or whitespace.");
    }
  }

  if (requestDetail) {
    if (isAllWhitespace(requestDetail)) {
      errors.push("Request detail cannot be empty or whitespace.");
    }
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return [];
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = {
  requestLogger,
  validateInventoryQueryParams,
  validateResourceId,
  validateInventoryInput,
  validateDeviceTypeInput,
  validateRequestQueryParams,
  validateRequestInput,
  errorHandler
};