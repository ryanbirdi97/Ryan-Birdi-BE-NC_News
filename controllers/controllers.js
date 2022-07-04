const { fetchTopics, fetchArticleId } = require("../models/models");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
