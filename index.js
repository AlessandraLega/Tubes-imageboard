const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

app.use(express.static("public"));
app.use(express.json());

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
    // console.log("req.file from index.js post/upload: ", req.file);
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

app.get("/modal/:id", (req, res) => {
    let id = req.params.id;
    // console.log(req.params);
    db.getModalImage(id).then((results) => {
        res.json(results.rows[0]);
    });
});

app.post("/comment", (req, res) => {
    db.addComment(req.body.curId, req.body.comment, req.body.commentUsername)
        .then((results) => {
            console.log("add comment: ", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in post comment: ", err);
        });
});

app.get("/comments/:id", (req, res) => {
    let id = req.params.id;
    console.log();
    db.getComments(id).then((results) => {
        // console.log("get comments: ", results.rows);
        res.json(results.rows);
    });
});

app.get("/more/:id", (req, res) => {
    db.getMoreImages(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => console.log("error in more: ", err));
});

app.post("/delete", (req, res) => {
    db.deleteComments(req.body.id)
        .then(() => {
            db.deleteImg(req.body.id)
                .then(() => {
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("error in deleteImg");
                });
        })
        .catch((err) => {
            console.log("error in deleteComments: ", err);
        });
});

app.get("/next/:lastId", (req, res) => {
    db.getNext(req.params.lastId).then((results) => {
        res.json(results.rows[0]);
    });
});

app.listen(8080, () => console.log("listening"));
