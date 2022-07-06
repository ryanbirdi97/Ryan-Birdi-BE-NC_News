const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticleId = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article id not found`,
        });
      }
      return rows[0];
    });
};

exports.updateVotes = (id, votes) => {
  if (!votes.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1 
    WHERE article_id = $2
    RETURNING *;`,
      [votes.inc_votes, id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article id not found`,
        });
      }
      return result.rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id):: INT AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.addComment = (articleID, newComment) => {
  const { username, body } = newComment;
  if (
    username &&
    typeof username === "string" &&
    body &&
    typeof body === "string" &&
    Object.keys(newComment) !== 2
  ) {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [articleID])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `Article id not found`,
          });
        }
      })
      .then(() => {
        return db
          .query(
            `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
            [username, body, articleID]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  }
};
