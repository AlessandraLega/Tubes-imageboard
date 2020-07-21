const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImages: ", err);
        });
});

app.listen(8080, () => console.log("listening"));
