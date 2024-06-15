const express = require("express");
const multer = require("multer");
const tesseract = require("tesseract.js");

const uploadRouter = express.Router();
module.exports = { uploadRouter };
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

uploadRouter.post("/", upload.single("image"), (req, res) => {
  console.log("request");
  try {
    const imageBuffer = req.file.buffer;
    console.log("buffer");

    tesseract
      .recognize(imageBuffer, "eng", {
        logger: (m) => console.log(m),
      })
      .then(({ data: { text } }) => {
        console.log("recognized");

        const extractedGrades = extractGrades(text);
        res.json({ grades: extractedGrades });
      })
      .catch((err) => {
        console.error("Error during OCR processing:", err);
        res.status(500).send("Error processing the image");
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error (Code 2)" });
  }
});

function extractGrades(text) {
  let pattern = /\b\d+(\.\d+)?\/\d+(\.\d+)?\b/g;
  let matches = text.match(pattern);
  return matches;
}
