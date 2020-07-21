let spicedPg = require("spiced-pg");
let db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:alessandra:postgres@localhost:5432/caper-imageboard"
);

module.exports.getImages = function () {
    let q = `SELECT url, username, title, description FROM images`;
    return db.query(q);
};
