const User = require("../models/User");
const File = require("../models/File");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = require("express").Router();

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const dirctory = `./uploads/${req.query.userId}`;

    if (!fs.existsSync(dirctory)) {
      fs.mkdirSync(dirctory, { recursive: true });
    }

    callBack(null, dirctory);
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  },
});

let upload = multer({ storage: storage });

router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json("User already exists");
    }
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
    });

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json("User not found");
  } // wrong credentials

  if (user.password !== req.body.password) {
    return res.status(401).json("Incorrect password"); // wrong credentials
  }
  res.send(user);
});

router.get("/userfiles", async (req, res) => {
  const username = req.query.username;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json("User not found");
  }
  const files = await File.find({ userid: user._id });
  res.send(files);
});

router.post("/uploadfile", upload.single("file"), async (req, res) => {
  const file = req.file;
  const user = await User.findOne({ _id: req.query.userId });
  if (!user) {
    return res.status(400).json("User not found");
  }
  const newFile = new File({
    filename: req.file.originalname,
    filecode: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
    userid: user._id,
  });
  const savedFile = await newFile.save();

  res.send(savedFile);
});

module.exports = router;

router.delete("/deletefile", async (req, res) => {
  try {
    const fileId = req.query.fileId;
    const file = await File.findOne({ _id: fileId });
    if (!file) {
      return res.status(400).json("File not found");
    }
    await File.deleteOne({ _id: fileId });
    res.send("File deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/downloadfile", async (req, res) => {
  try {
    const fileId = req.query.fileId;
    const file = await File.findOne({ _id: fileId });
    if (!file) {
      return res.status(400).json("File not found");
    }

    let absPath = path.join(
      __dirname,
      `../uploads/${file.userid}`,
      file.filename
    );

    res.download(absPath);
  } catch (err) {
    return res.status(500).json(err);
  }
});
