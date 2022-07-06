const {
  fetchTopics,
  fetchArticleId,
  updateVotes,
  fetchUsers,
  fetchArticles,
  addComment,
} = require("../models/models");

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

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;
  updateVotes(article_id, votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getArticles = (req, res) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.postArticleComment = (req, res, next) => {
  const { articleID } = req.params;
  const newComment = req.body;
  addComment(articleID, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
