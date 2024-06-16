const express = require("express");
const calculateRouter = express.Router();
module.exports = { calculateRouter };

const { recognize } = require("./helpers");
const { ptsOutOfPts } = require("./ptsOutOfPts");
const { grades } = require("./grades");
const { percentage } = require("./percentage");

calculateRouter.post("/", (req, res) => {
  try {
    if (!req.body.grades) {
      return res.status(400).json({ error: "Grades missing." });
    }
    if (typeof req.body.grades == "string") {
      req.body.grades = JSON.parse(req.body.grades);
    }
    const mode = Number(req.body.mode);
    console.log(mode);
    if (isNaN(mode)) {
      throw new Error();
    }
    switch (mode) {
      case 1:
        ptsOutOfPts(req, res);
        break;
      case 2:
        grades(req, res);
        break;
      case 3:
        percentage(req, res);
        break;
      default:
        throw new Error();
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Wrong mode specified" });
  }
});
