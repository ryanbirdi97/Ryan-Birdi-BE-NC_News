const express = require("express");
const {
  getTopics,
  getArticleId,
  patchVotes,
  getUsers,
} = require("./controllers/controllers");
const {
  psqlErrorHandler,
  unhandledErrors,
  handleCustomErrors,
} = require("./errors/error-handler");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.patch("/api/articles/:article_id", patchVotes);

app.get("/api/users", getUsers);

//Error Handlers
app.use(psqlErrorHandler);
app.use(handleCustomErrors);
app.use(unhandledErrors);

module.exports = app;
