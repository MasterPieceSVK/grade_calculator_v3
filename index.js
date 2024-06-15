const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const { uploadRouter } = require("./upload/upload");
const { calculateRouter } = require("./calculate/calculate");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/upload", uploadRouter);
app.use("/calculate", calculateRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports.handler = serverless(app);

app.get("/", (req, res) => {
  res.send("Hey");
});

app.get("/health", (req, res) => {
  res.send("alive");
});
