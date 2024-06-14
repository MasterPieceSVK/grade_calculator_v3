const express = require("express");
const calculateRouter = express.Router();

module.exports = { calculateRouter };

calculateRouter.post("/", (req, res) => {
  try {
    // grades = array, wanted = percentage (e.g 85%), nextPoints = Number
    let { grades, wanted, nextPoints } = req.body;
    if (!grades || !wanted || !nextPoints) {
      return res.status(400).json({ error: "Parameter/s missing." });
    }

    wanted = Number(wanted);
    nextPoints = Number(nextPoints);

    if (isNaN(wanted) || isNaN(nextPoints)) {
      return res.status(400).json({ error: "Please send numbers." });
    }

    grades = JSON.parse(grades);
    const earned = [];
    const max = [];

    try {
      grades.forEach((grade) => {
        const earn = Number(grade.split("/")[0]);
        const maxGrade = Number(grade.split("/")[1]);
        if (isNaN(earn) || isNaN(maxGrade)) {
          throw new Error();
        }

        earned.push(earn);
        max.push(maxGrade);
      });
    } catch {
      return res.status(400).json({ error: "Please send numbers." });
    }

    const points = calculate(earned, max, wanted, nextPoints);

    res.json({
      points,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error (Code 1)" });
  }
});

function calculate(earned, max, wanted, nextPoints) {
  earned = earned.reduce((a, b) => a + b, 0);
  max = max.reduce((a, b) => a + b, 0);

  return ((max + nextPoints) * wanted - earned).toFixed(2);
}
