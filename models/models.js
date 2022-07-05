const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticleId = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
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
