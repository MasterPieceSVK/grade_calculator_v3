const { calculate } = require("./ptsOutOfPts");

function percentage(req, res) {
  try {
    let { wanted, nextWeight } = req.body;
    let { grades } = req;

    if (!grades || !wanted || !nextWeight) {
      return res.status(400).json({ error: "Parameter/s missing." });
    }
    wanted = Number(wanted);
    nextWeight = Number(nextWeight);
    if (isNaN(wanted) || isNaN(nextWeight)) {
      return res.status(400).json({ error: "Please send numbers." });
    }

    try {
      const earned = convertToPoints(grades);
      const maxPoints = convertToMaxPoints(grades);

      const needed = `${(
        calculate(earned, maxPoints, wanted, nextWeight) * 100
      ).toFixed(1)}%`;
      res.json({ needed });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ error: "Error while converting to points." });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error (Code 4)" });
  }
}

function convertToPoints(grades) {
  return grades.map((grade) => {
    const weight = grade.split("@")[1] || 1;
    return (grade = (Number(grade.split("%")[0]) / 100) * weight);
  });
}

function convertToMaxPoints(grades) {
  return grades.map((grade) => {
    return Number(grade.split("@")[1] || 1);
  });
}

module.exports = { percentage };
