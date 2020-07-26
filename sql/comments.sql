DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    comment VARCHAR CHECK (comment != ''),
    comment_username VARCHAR CHECK (comment_username !=''),
    image_id INT REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
