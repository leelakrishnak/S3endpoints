const express = require("express");
const s3config = require("./s3_config.json");
const aws = require("aws-sdk");
const app = express();

/**
 * This is a wrapper to avoid exposing out AWS keys to the browser,
 * when browser needs to upload/download a file, it will ask these endpoints for the URL
 * instead of talking directly, following API will generate signed url which only be alive
 * certain seconds.
 */

/**
 * Make sure you have s3_config.json file with following s3 credentials
 * before running the app
 * {
 * accessKeyId: xxxx,
 * secretAccessKey: xxxx,
 * region: xxxx
 * }
 */

const s3 = new aws.S3({
  accessKeyId: s3config.accessKeyId,
  secretAccessKey: s3config.secretAccessKey,
  region: s3config.region
});

const PORT = 8000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**
 * Download API, this will fetch signed url from the s3,
 * this url is alive only 120 seconds
 */
app.get("/getdownloadurl", (req, res) => {
  let file = req.query;
  let params = {
    Bucket: file.bucketName,
    Key: file.key,
    Expires: 120 //120 seconds
  };
  try {
    let link = s3.getSignedUrl("getObject", params);
    res.send({ result: "success", url: link });
  } catch (e) {
    console.error("Got an error " + e.code + " : " + e.message);
  }
  res.send({ result: "failed" });
});

/**
 * Upload API, this will fetch signed url from the s3,
 * this url is alive only 120 seconds
 */
app.get("/getuploadurl", (req, res) => {
  let file = req.query;
  let bucketName = `mybucket_name`;
  let key = `${Date.now()}_${file.name}`;
  let params = {
    ACL: "public-read",
    Bucket: bucketName,
    Key: key,
    Expires: 120, //alive 120 seconds,
    ContentType: file.type
  };
  let link = s3.getSignedUrl("putObject", params);
  res.send({
    result: "success",
    info: {
      name: key,
      url: link,
      bucketName: bucketName
    }
  });
});

/**
 * Delete end point to delete object from the s3.
 */
app.post("/deletefile", async (req, res) => {
  let file = req.query;
  let params = {
    Bucket: file.bucketName,
    Key: file.key
  };
  await s3.deleteObject(params, err => {
    if (err) console.log(err, err.stack);
    else console.log("successfully deleted");
  });

  res.send({ result: "success" });
});

app.listen(PORT, () => console.log("Server started on " + PORT));
