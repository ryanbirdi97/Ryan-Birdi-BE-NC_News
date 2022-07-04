const { fetchTopics } = require("../models/models");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
