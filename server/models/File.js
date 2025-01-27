const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filecode: { type: String, required: true },
  userid: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("File", FileSchema);
