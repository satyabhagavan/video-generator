const router = require("express").Router();
const { doesNotMatch } = require("assert");
const fs = require("fs");
const gTTS = require("gtts");
var multer = require("multer");
var path = require("path");
var upload = multer({ dest: "storage/" });

router.route("/").get((req, res) => {
  res.status(200).json({ message: "backend is fine" });
});

router.route("/create_storage").post((req, res) => {
  const temp = Date.now().toString();

  const folderName = `./storage/${temp}`;
  //   const folderName = temp;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);

    res.status(400).json({ message: "Error in creating storage" });
  }

  res
    .status(201)
    .json({ token: temp, message: "Storage Created Successfully" });
});

var type = upload.single("recfile");

router.route("/upload_file").post(type, (req, res) => {
  // console.log(req);
  let token = req.body.token;
  // console.log(token);
  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/

  var tmp_path = req.file.path;

  // /** The original name of the uploaded file
  //       stored in the variable "originalname". **/
  var target_path = `storage/${token}/` + req.file.originalname;

  // /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on("end", function () {
    res.status(201).json({ message: "file uploaded successfully" });
    return;
  });
  src.on("error", function (err) {
    res.status(400).json("error");
  });
});

router.route("/text_to_audio").post((req, res) => {
  const token = req.body.token;
  const fileName = req.body.fileName;

  const folderName = `./storage/${token}`;

  const file = folderName + "/" + fileName;
  const audioFile =
    `./storage/${token}` +
    "/audio_file_of_" +
    fileName.split(".").slice(0, -1).join(".") +
    "_" +
    Date.now().toString() +
    ".mp3";

  const buffer = fs.readFileSync(file);
  const fileContent = buffer.toString();
  console.log(fileContent);
  var gtts = new gTTS(fileContent, "en");

  console.log(audioFile);
  try {
    gtts.save(audioFile, function (err, result) {
      if (err) {
        throw new Error(err);
      }
      console.log("file creation success");
      res.status(201).json({
        message: "text to speech converted",
        fileName: audioFile,
      });
      return;
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "error occured while creating audio file" });
  }
});

router.route("/my_files").get(async (req, res) => {
  //console.log(req.headers.token);
  const token = req.headers.token;
  const folderName = `./storage/${token}`;

  let uploads = [];

  try {
    const files = await fs.promises.readdir(folderName);
    files.forEach(function (file) {
      uploads.push(file);
      //   console.log(uploads);
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "error occured while retreavig data" });
  }

  res.status(200).json({ data: uploads });
});

router.route("/download").get((req, res) => {
  let token = req.query.token;
  let fileName = req.query.file;

  // const filePath = `/stoage/${token}/${fileName}`;
  const file = __dirname;

  let filePath = path.join(__dirname, "..", "storage", token, fileName);
  console.log(filePath);
  res.download(filePath);
});

module.exports = router;
