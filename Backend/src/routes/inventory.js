const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middleware");

// GET /api/papers
router.get("/", middleware.validatePaperQueryParams, async (req, res, next) => {
  try {
    // TODO: Implement GET /api/papers
    //
    // 1. Extract query parameters:
    //    - year (optional)
    //    - publishedIn (optional)
    //    - author (optional)
    //    - limit (optional, default: 10)
    //    - offset (optional, default: 0)
    //
    // 2. Call db.getAllPapers with filters
    //
    // 3. Send JSON response with status 200:
    //    res.json({
    //      papers,  // Array of papers with their authors
    //      total,   // Total number of papers matching filters
    //      limit,   // Current page size
    //      offset   // Current page offset
    //    });
    const papers = await db.getAllPapers(req.query);
    res.status(200).json({
      papers: papers.papers,
      total: papers.total,
      limit: papers.limit,
      offset: papers.offset,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/papers/:id
router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement GET /api/papers/:id
    //
    // 1. Get paper ID from req.params
    //
    // 2. Call db.getPaperById
    //
    // 3. If paper not found, return 404
    //
    // 4. Send JSON response with status 200:
    //    res.json(paper);
    const paper = await db.getPaperById(parseInt(req.params.id));
    if (!paper) {
      return res.status(404).json({error: "Paper not found"});
    } else {
      return res.status(200).json(paper);
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/papers
router.post("/", async (req, res, next) => {
  try {
    // TODO: Implement POST /api/papers
    //
    // 1. Validate request body using middleware.validatePaperInput
    //
    // 2. If validation fails, return 400 with error messages
    //
    // 3. Call db.createPaper
    //
    // 4. Send JSON response with status 201:
    //    res.status(201).json(paper);
    const error = middleware.validatePaperInput(req.body);
    console.log(error);
    if (error.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: error });
    }
    let paper = await db.createPaper(req.body);
    res.status(201).json(paper);
  } catch (error) {
    next(error);
  }
});

// PUT /api/papers/:id
router.put("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement PUT /api/papers/:id
    //
    // 1. Get paper ID from req.params
    //
    // 2. Validate request body using middleware.validatePaperInput
    //
    // 3. If validation fails, return 400 with error messages
    //
    // 4. Call db.updatePaper
    //
    // 5. If paper not found, return 404
    //
    // 6. Send JSON response with status 200:
    //    res.json(paper);
    const errors = middleware.validatePaperInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation Error", messages: errors });
    }
    req.params.id = parseInt(req.params.id);
    const paper = await db.getPaperById(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: "Paper not found" });
    }
    const newPaper = await db.updatePaper(req.params.id, req.body);
    return res.status(200).json(newPaper);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/papers/:id
router.delete("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    // TODO: Implement DELETE /api/papers/:id
    //
    // 1. Get paper ID from req.params
    //
    // 2. Call db.deletePaper
    //
    // 3. If paper not found, return 404
    //
    // 4. Send no content response with status 204:
    //    res.status(204).end();
    req.params.id = parseInt(req.params.id);
    const paper = await db.getPaperById(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: "Paper not found" });
    } else {
      await db.deletePaper(req.params.id);
      return res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;