function grades(req, res) {
  try {
    console.log("grades");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error (Code 3)" });
  }
}

module.exports = { grades };
