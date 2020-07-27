let spicedPg = require("spiced-pg");
let db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:alessandra:postgres@localhost:5432/caper-imageboard"
);

module.exports.getImages = function () {
    let q = `SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1) AS "lowestId"
            FROM images ORDER BY id DESC LIMIT 6`;
    return db.query(q);
};

module.exports.getMoreImages = function (lastId) {
    let q = `SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1) AS lowestId
            FROM images 
            WHERE id < $1 
            ORDER BY id DESC 
            LIMIT 6`;
    let params = [lastId];
    return db.query(q, params);
};

/* module.exports.getFirstId = function () {
    let q = ;
    return db.query(q);
}; */

module.exports.addImage = function (url, username, title, description) {
    let q = `INSERT INTO images (url, username, title, description)
            VALUES ($1, $2, $3, $4) RETURNING *`;
    let params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getModalImage = function (id) {
    let q = `SELECT *, (
            SELECT id FROM images
            WHERE id > $1
            ORDER BY id ASC
            LIMIT 1) AS lastId,
            (SELECT id FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 1) AS nextId
            FROM images
            WHERE id = $1`;
    let params = [id];
    return db.query(q, params);
};

module.exports.addComment = function (curId, comment, commentUsername) {
    let q = `INSERT INTO comments (image_id, comment, comment_username) VALUES ($1, $2, $3) RETURNING *`;
    let params = [curId, comment, commentUsername];
    return db.query(q, params);
};

module.exports.getComments = function (curId) {
    let q = `SELECT * FROM comments WHERE image_id = $1 ORDER BY id DESC`;
    let params = [curId];
    return db.query(q, params);
};
