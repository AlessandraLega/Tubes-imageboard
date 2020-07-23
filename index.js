const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

app.use(express.static("public"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImages: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file from index.js post/upload: ", req.file);
    // console.log("req.body from index.js post/upload: ", req.body);
    const { title, desc, username } = req.body;
    const { filename } = req.file;
    const url = s3Url + filename;

    db.addImage(url, username, title, desc).then((results) => {
        res.json(results.rows[0]);
    });

    // if (req.file) {
    //     res.json({
    //         success: true,
    //     });
    // } else {
    //     res.json({
    //         success: false,
    //     });
    // }
});

app.listen(8080, () => console.log("listening"));
