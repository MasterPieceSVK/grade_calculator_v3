function recognize(grades, res) {
  try {
    if (grades[0].includes("/")) {
      return 1;
    } else if (grades[0].includes("%")) {
      return 3;
    } else if (grades[0] >= 1 && grades[0] <= 5) {
      return 2;
    } else {
      throw new Error();
    }
  } catch {
    res.status(400).json({ error: "Wrong mode specified." });
  }
}

module.exports = { recognize };
