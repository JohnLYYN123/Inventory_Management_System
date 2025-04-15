const { off } = require("./server");

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

// Validate paper input for Assignment 2
// Note: This is different from Assignment 1 as it handles authors as objects
const validatePaperInput = (paper) => {
  // TODO: Implement paper validation
  //
  // Required fields:
  // - title: non-empty string
  // - publishedIn: non-empty string
  // - year: integer > 1900
  // - authors: non-empty array of author objects
  //   where each author must have:
  //   - name: required, non-empty string
  //   - email: optional string
  //   - affiliation: optional string
  //
  // Return array of error messages, for example:
  // [
  //   "Title is required",
  //   "Published venue is required",
  //   "Valid year after 1900 is required",
  //   "At least one author is required"
  // ]
  const errors = [];
  if (!paper.title || isAllWhitespace(paper.title) || typeof paper.title !== "string") {
    errors.push("Title is required");
  }
  if (!paper.publishedIn || isAllWhitespace(paper.publishedIn) || typeof paper.publishedIn !== "string") {
    errors.push("Published venue is required");
  }
  if (!paper.year) {
    errors.push("Published year is required");
  } else if (!Number.isInteger(paper.year) || (paper.year) <= 1900 || (paper.year) > 2025) {
    errors.push("Valid year after 1900 is required");
  } 
  if (!paper.authors || paper.authors.length === 0 || !Array.isArray(paper.authors)) {
    errors.push("At least one author is required");
  } else {
    paper.authors.some((author, index) => {
      if (!author.name || isAllWhitespace(author.name) || isNumber(author.name)) {
        errors.push(`Author name is required`);
        return true;
      }
      return false;
    });
  }
  return errors;
};

// Validate author input
const validateAuthorInput = (author) => {
  // TODO: Implement author validation
  //
  // Required fields:
  // - name: non-empty string
  //
  // Optional fields:
  // - email: string
  // - affiliation: string
  //
  // Return array of error messages, for example:
  // [
  //   "Name is required"
  // ]
  const errors = [];
  if (!author.name || isAllWhitespace(author.name) || typeof author.name !== 'string' || author.name === null) {
    errors.push("Name is required");
  }
  if (author.email) {
    if (isAllWhitespace(author.email) || typeof author.email !== 'string') {
      errors.push("Email is required");
    }
  }
  if (author.affiliation) {
    if (isAllWhitespace(author.affiliation) || typeof author.affiliation !== 'string') {
      errors.push("Affiliation is required");
    }
  }
  return errors;
};

// Validate query parameters for papers
const validatePaperQueryParams = (req, res, next) => {
  // TODO: Implement query parameter validation for papers
  //
  // Validate:
  // - year: optional, must be integer > 1900 if provided
  //   - Parse string to integer
  //   - Update req.query.year with the parsed value
  // - publishedIn: optional, string
  //   - No parsing needed
  // - author: optional, string
  //   - No parsing needed
  // - limit: optional, must be positive integer <= 100 if provided
  //   - Parse string to integer
  //   - Default to 10 if not provided
  //   - Update req.query.limit with the parsed value
  // - offset: optional, must be non-negative integer if provided
  //   - Parse string to integer
  //   - Default to 0 if not provided
  //   - Update req.query.offset with the parsed value
  //
  // If invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid query parameter format"
  // }
  //
  // If valid, call next()
  const errors = [];
  if (req.query.hasOwnProperty('year')) {
    if (req.query.year === "") {
      errors.push("Valid year after 1900 is required");
    } else {
      if (isAllWhitespace(req.query.year) || !isNumber(req.query.year) || /\./.test(req.query.year) || req.query.year.includes(".")) {
        errors.push("Valid year after 1900 is required");
      }
      const year = parseInt(req.query.year);
      if (year <= 1900 || year > 2025) {
        errors.push("Valid year after 1900 is required");
      }
      req.query.year = year;
    }
  }

  if (req.query.limit) {
    if (isAllWhitespace(req.query.limit) || !isNumber(req.query.limit) || req.query.limit.includes(".")) {
      errors.push("Limit must be between 1 and 100");
    }
    const limit = parseInt(req.query.limit);
    if (limit <= 0 || limit > 100) {
      errors.push("Limit must be between 1 and 100");
    }
    req.query.limit = limit;
  } else {
    req.query.limit = 10;
  }
   
  if (req.query.hasOwnProperty('publishedIn')) {
    if (req.query.publishedIn === "") {
      delete req.query.publishedIn;
    } else {
      if (isNumber(req.query.publishedIn) || isAllWhitespace(req.query.publishedIn)) {
        errors.push("Published venue is required");
      }
    }
  }
  
  if (req.query.hasOwnProperty('author')) {
    if (typeof req.query.author === 'string') {
      if (isAllWhitespace(req.query.author)) {
        errors.push("Author is required");
      }
    } else if (Array.isArray(req.query.author)) {
      for (const author of req.query.author) {
        if (typeof author === 'string') {
            if (isAllWhitespace(author)) {
                errors.push("Author is required");
                break;
            }
        } else {
            errors.push("Author must be a string or an array of strings");
            break;
        }
     }
    } else {
      errors.push("Author must be a string or an array of strings");
    }
  }

  if (req.query.offset) {
    if (isAllWhitespace(req.query.offset) || !isNumber(req.query.offset) || req.query.offset.includes('.')) {
      errors.push("Offset must be greater than or equal to 0");
    }
    req.query.offset = parseInt(req.query.offset);
    if (req.query.offset < 0) {
      errors.push("Offset must be greater than or equal to 0");
    }
    
  } else {
    req.query.offset = 0;
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation Error", message: "Invalid query parameter format" });
  } else {
    next();
  }
};

// Validate query parameters for authors
const validateAuthorQueryParams = (req, res, next) => {
  // TODO: Implement query parameter validation for authors
  //
  // Validate:
  // - name: optional, string
  // - affiliation: optional, string
  // - limit: optional, must be positive integer <= 100 if provided
  // - offset: optional, must be non-negative integer if provided
  //
  // If invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid query parameter format"
  // }
  //
  // If valid, call next()
  const errors = [];
  if (req.query.hasOwnProperty('name')) {
    if (isNumber(req.query.name) || isAllWhitespace(req.query.name) || req.query.name === "") {
      errors.push("Name is required");
    }
  }
  if (req.query.hasOwnProperty('affiliation')) {
    if (isNumber(req.query.affiliation) || isAllWhitespace(req.query.affiliation) || req.query.affiliation === "") {
      errors.push("Affiliation is required");
    }
  }
  if (req.query.limit) {
    if (isAllWhitespace(req.query.limit) || !isNumber(req.query.limit) || req.query.limit.includes(".")) {
      errors.push("Limit must be between 1 and 100");
    }
    const limit = parseInt(req.query.limit);
    if (limit <= 0 || limit > 100) {
      errors.push("Limit must be between 1 and 100");
    }
    req.query.limit = limit;
  } else {
    req.query.limit = 10;
  }
  if (req.query.offset) {
    if (isAllWhitespace(req.query.offset) || !isNumber(req.query.offset) || req.query.offset.includes(".")) {
      errors.push("Offset must be greater than or equal to 0");
    }
    const offset = parseInt(req.query.offset);
    if (offset < 0) {
      errors.push("Offset must be greater than or equal to 0");
    }
    req.query.offset = offset;
  } else {
    req.query.offset = 0;
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation Error", message: "Invalid query parameter format" });
  } else {
    next();
  }
};

// Validate resource ID parameter
// Used for both paper and author endpoints
const validateResourceId = (req, res, next) => {
  // TODO: Implement ID validation
  //
  // If ID is invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid ID format"
  // }
  //
  // If valid, call next()
  if (/\./.test(req.params.id)) {
    return res.status(400).json({ error: "Validation Error", message: "Invalid ID format" });
  }
  if (isNumber(req.params.id)) {
    let id = parseFloat(req.params.id);
    if (isFloat(id) || id <= 0) {
      return res.status(400).json({ error: "Validation Error", message: "Invalid ID format" });
    } else {
      next();
    }
  } else {
    return res.status(400).json({ error: "Validation Error", message: "Invalid ID format" });
  }
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

module.exports = {
  requestLogger,
  validatePaperInput,
  validateAuthorInput,
  validatePaperQueryParams,
  validateAuthorQueryParams,
  validateResourceId,
  errorHandler,
  isAllWhitespace,
  isNumber,
  isFloat,
};
