const router = require("express").Router();
const fs = require("fs");
const { exec } = require("child_process");

router.route("/").get((req, res) => {
  res.status(200).json({ message: "backend is fine" });
});

router.route("/audio_and_image").post((req, res) => {
  const token = req.body.token;
  let audioFile = req.body.audio_file;
  let imageFile = req.body.image_file;

  const finalFile =
    "video_of_" +
    audioFile.split(".").slice(0, -1).join(".") +
    "_" +
    imageFile.split(".").slice(0, -1).join(".") +
    ".mp4";

  audioFile = `storage/${token}/${audioFile}`;
  imageFile = `storage/${token}/${imageFile}`;
  const outputFile = `storage/${token}/${finalFile}`;

  exec(
    `ffmpeg -loop 1 -i ${imageFile} -i ${audioFile} -c:v libx264 -c:a aac -shortest -y -r 30 -s 720x480 -f mp4  ${outputFile}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );

  res.status(201).json({ message: "", video_file: finalFile });
});

router.route("/merge_videos").post((req, res) => {
  const token = req.body.token;
  const listOfVideos = req.body.list_of_videos;

  console.log(listOfVideos);

  //create a list of files
  let listOfVideosFile = `storage/${token}/listOfVideosFile.txt`;
  let textContent = "";

  listOfVideos.forEach((element) => {
    textContent = textContent + "file " + element + "\n";
  });

  // console.log(textContent);

  fs.writeFileSync(listOfVideosFile, textContent);
  // console.log("File created");

  const mergerFileName = Date.now().toString() + ".mp4";
  const finalFilePath = `storage/${token}/` + mergerFileName;

  exec(
    `ffmpeg -f concat -i ${listOfVideosFile} -c copy ${finalFilePath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );

  res.status(200).json({
    message: "merged all videos successfully",
    video_file: mergerFileName,
  });
});

router.route("/audio_and_video").post((req, res) => {
  const token = req.body.token;
  let audioFile = req.body.audio_file;
  let videoFile = req.body.video_file;

  audioFile = `storage/${token}/${audioFile}`;
  videoFile = `storage/${token}/${videoFile}`;

  let newFile = Date.now().toString() + ".mp4";
  newFile = `storage/${token}/${newFile}`;

  exec(
    `ffmpeg -i ${videoFile} -i ${audioFile} -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -y ${newFile}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.status(401).json({
          message: "error occured while changing audio",
        });
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );

  res.status(201).json({
    message: "audio changed for the video",
    fileName: newFile,
  });
});

module.exports = router;
