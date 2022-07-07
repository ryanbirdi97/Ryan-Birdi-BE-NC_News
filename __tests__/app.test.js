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
            comment_count: expect.any(Number),
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
      });
  });
});

describe("GET /api/articles", () => {
  test("responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        body.articles.forEach((users) => {
          expect(users).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("returned array is in date decending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          decending: true,
          coerce: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("responds with a array of comment objects of given id", () => {
    const articleID = 5;
    return request(app)
      .get(`/api/articles/${articleID}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(2);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: articleID,
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("404: responds with an error msg if the id does not exist", async () => {
    const articleID = 1010;
    return request(app)
      .get(`/api/articles/${articleID}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Article id not found`);
      });
  });
  test("400: responds with an error msg if the id is not a number", async () => {
    const articleID = "dog";
    return request(app)
      .get(`/api/articles/${articleID}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad Request`);
      });
  });
  test("200: if article has no comments returns an empty array", async () => {
    const articleID = 2;
    return request(app)
      .get(`/api/articles/${articleID}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: request body accepts an object to post a comment", () => {
    const articleID = 1;
    const newComment = { username: "icellusedkars", body: "This is a test" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toBeInstanceOf(Object);
        expect(body.comment).toMatchObject({
          body: newComment.body,
          votes: expect.any(Number),
          author: newComment.username,
          article_id: articleID,
          created_at: expect.any(String),
        });
      });
  });
  test("400: if article id is wrong data type", () => {
    const articleID = "dog";
    const newComment = { username: "icellusedkars", body: "This is a test" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: if article id does not exist", () => {
    const articleID = 1010;
    const newComment = { username: "icellusedkars", body: "This is a test" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article id not found");
      });
  });
  test("400: if request body is an empty object", () => {
    const articleID = 1;
    const newComment = {};
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: if request body only has 1 key", () => {
    const articleID = 1;
    const newComment = { username: "icellusedkars" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: if request body key is the wrong datatype", () => {
    const articleID = 1;
    const newComment = { username: "icellusedkars", body: 1 };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("200: returned array is in date acending order", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("400: if order query value is spelt wrong", () => {
    return request(app)
      .get("/api/articles?order=bsc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order");
      });
  });
  test("200: returned array is sorted in vote decending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("400: if sort_by query value is spelt wrong", () => {
    return request(app)
      .get("/api/articles?sort_by=vots")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort by");
      });
  });
  test("200: accepts topic query which filters articles of that topic", () => {
    return request(app)
      .get(`/api/articles?topic=mitch`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(11);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("400: if topic query value is spelt wrong", () => {
    return request(app)
      .get("/api/articles?topic=dave")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid topic");
      });
  });
  test("200: return array with 2 queries", () => {
    return request(app)
      .get("/api/articles?order=ASC&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  test("200: return array with 3 queries given", () => {
    return request(app)
      .get("/api/articles?order=ASC&sort_by=votes&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          descending: false,
        });
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});
