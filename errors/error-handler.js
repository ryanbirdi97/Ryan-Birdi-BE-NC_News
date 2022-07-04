exports.psqlErrorHandler = (err, req, res, next) => {
  if (err?.code) {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.unhandledErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
};
