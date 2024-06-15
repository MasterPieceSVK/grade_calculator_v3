function ptsOutOfPts(req, res) {
  try {
    // grades = array, wanted = percentage (e.g 85%), nextPoints = Number
    let { wanted, nextPoints } = req.body;
    let { grades } = req;
    if (!grades || !wanted || !nextPoints) {
      return res.status(400).json({ error: "Parameter/s missing." });
    }
    wanted = Number(wanted);
    nextPoints = Number(nextPoints);

    if (isNaN(wanted) || isNaN(nextPoints)) {
      return res.status(400).json({ error: "Please send numbers." });
    }

    const earned = [];
    const max = [];

    try {
      grades.forEach((grade) => {
        const weight = Number(grade.split("@")[1]);
        let earn = Number(grade.split("@")[0].split("/")[0]);
        let maxGrade = Number(grade.split("@")[0].split("/")[1]);

        if (isNaN(earn) || isNaN(maxGrade)) {
          console.log("as");
          throw new Error();
        }

        if (weight) {
          earn = earn * weight;
          maxGrade = maxGrade * weight;
        }

        earned.push(earn);
        max.push(maxGrade);
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "Please send numbers." });
    }

    const needed = calculate(earned, max, wanted, nextPoints);

    res.json({
      needed,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error (Code 1)" });
  }
}

function calculate(earned, max, wanted, nextPoints) {
  earned = earned.reduce((a, b) => a + b, 0);
  max = max.reduce((a, b) => a + b, 0);

  return ((max + nextPoints) * wanted - earned).toFixed(2);
}

module.exports = { ptsOutOfPts, calculate };
