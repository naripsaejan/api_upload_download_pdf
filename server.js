const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const app = express();

//connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourdbname", {
  useNewUrlParser: true,
});

//create a Mongoose model
const YourModel = mongoose.model("YourModel", {
  name: String,
  file: { type: Buffer },
});

//configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const newFile = new YourModel({
    name: req.body.name,
    file: req.file.buffer,
  });

  newFile.save((err, data) => {
    if (err) res.send(err);
    else res.send(data);
  });
});

app.get("/download/:id", (req, res) => {
  YourModel.findById(req.params.id, (err, file) => {
    if (err) res.send(err);
    else {
      res.set("Content-Type", "application/pdf");
      res.set("Content-Disposition", `attachment; filename=${file.name}.pdf`);
      res.send(file.file);
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
