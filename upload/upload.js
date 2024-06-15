const express = require("express");
const multer = require("multer");
const tesseract = require("tesseract.js");

const uploadRouter = express.Router();
module.exports = { uploadRouter };
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

uploadRouter.post("/", upload.single("image"), (req, res) => {
  console.log("Request received");
  if (!req.file) {
    console.error("No file received");
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const imageBuffer = req.file.buffer;
    console.log("File buffer received");

    tesseract
      .recognize(imageBuffer, "eng", {
        logger: (m) => console.log(m),
      })
      .then(({ data: { text } }) => {
        console.log("Text recognition completed");

        const extractedGrades = extractGrades(text);
        res.json({ grades: extractedGrades });
      })
      .catch((err) => {
        console.error("Error during OCR processing:", err);
        res.status(500).send("Error processing the image");
      });
  } catch (e) {
    console.error("Error processing the request:", e);
    res.status(500).json({ error: "Error (Code 2)" });
  }
});

function extractGrades(text) {
  let pattern = /\b\d+(\.\d+)?\/\d+(\.\d+)?\b/g;
  let matches = text.match(pattern);
  return matches;
}
