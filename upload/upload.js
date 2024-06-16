const express = require("express");
const multer = require("multer");
const tesseract = require("tesseract.js");
const { recognize } = require("../calculate/helpers");

const uploadRouter = express.Router();
module.exports = { uploadRouter };

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Invalid file type");
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

uploadRouter.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "mode", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("Request received");
    if (!req.files || !req.files.image) {
      console.error("No file received");
      return res
        .status(400)
        .json({ error: "No file uploaded or invalid file type" });
    }

    const { mode } = req.body;
    if (!mode) {
      return res.status(400).json({ error: "No mode specified" });
    }

    try {
      const imageBuffer = req.files.image[0].buffer;
      console.log("File buffer received");

      tesseract
        .recognize(imageBuffer, "eng", {
          logger: (m) => console.log(m),
        })
        .then(({ data: { text } }) => {
          console.log("Text recognition completed");
          const extractedGrades = extractGrades(text, mode);

          res.json({ grades: extractedGrades, mode });
        })
        .catch((err) => {
          console.error("Error during OCR processing:", err);
          res.status(500).send("Error processing the image");
        });
    } catch (e) {
      console.error("Error processing the request:", e);
      res.status(500).json({ error: "Error (Code 2)" });
    }
  }
);

function extractGrades(text, mode) {
  let pattern;
  switch (mode) {
    case "1": {
      text = text.replace(/[a-zA-Z]/g, "");
      text = text.replace(/\/ /g, "/");
      pattern = /\b\d+(\.\d+)?\/\d+(\.\d+)?\b/g;
      break;
    }
    case "2": {
      console.log(2);
      break;
    }
    case "3": {
      pattern = /\b\d+(\.\d+)?%/g;
      break;
    }
  }

  let matches = text.match(pattern);
  return matches;
}

uploadRouter.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    next();
  }
});
