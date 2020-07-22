let spicedPg = require("spiced-pg");
let db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:alessandra:postgres@localhost:5432/caper-imageboard"
);

module.exports.getImages = function () {
    let q = `SELECT * FROM images ORDER BY id DESC`;
    return db.query(q);
};

module.exports.addImage = function (url, username, title, description) {
    let q = `INSERT INTO images (url, username, title, description)
            VALUES ($1, $2, $3, $4) RETURNING *`;
    let params = [url, username, title, description];
    return db.query(q, params);
};
