const express = require("express");
const {
  getTopics,
  getArticleId,
  getUsers,
  patchVotes,
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

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchVotes);

//Error Handlers
app.use(psqlErrorHandler);
app.use(handleCustomErrors);
app.use(unhandledErrors);

module.exports = app;
