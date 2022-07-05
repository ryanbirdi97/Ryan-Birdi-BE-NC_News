const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with an article object of given id", () => {
    const articleID = 1;
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article.article_id).toEqual(articleID);
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("404: responds with an error msg if the id does not exist", async () => {
    const articleID = 1010;
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Article id not found`);
      });
  });
  test("400: responds with an error msg if the id is not a number", async () => {
    const articleID = "dog";
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad Request`);
      });
  });
});

      });
  });
});
describe("GET /api/users", () => {
  test("responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        body.users.forEach((users) => {
          expect(users).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
=======
describe("PATCH /api/articles/:article_id", () => {
  test("request body accepts an object which updates the votes of the given article id", () => {
    const articleID = 1;
    const updateVote = { inc_votes: 5 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(updateVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toBe(105);
      });
  });
  test("request body accepts an object which decrements the votes if number is negative of the given article id", () => {
    const articleID = 1;
    const updateVote = { inc_votes: -5 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(updateVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toBe(95);
      });
  });
  test("throws an error if article ID does not exist", () => {
    const articleID = 1010;
    const updateVote = { inc_votes: 5 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(updateVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Article id not found`);
      });
  });
  test("throws an error if article ID is an invalid data type", () => {
    const articleID = "dog";
    const newVote = { inc_votes: 2 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad Request`);
      });
  });
  test("throws an error if inc_votes is an invalid data type", () => {
    const articleID = 1;
    const newVote = { inc_votes: "dog" };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad Request`);
      });
  });
  test("throws an error if votes is an empty object", () => {
    const articleID = 1;
    const newVote = {};
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad Request`);

      });
  });
});
