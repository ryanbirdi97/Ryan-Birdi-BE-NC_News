# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## 1) Setup

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment. Make sure to add it to the `.gitignore` before you start pushing to your repository.

You have also been provided with a `db` folder with some data, a `setup.sql` file and a seeds folder. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

The job of `index.js` in each the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually. Think of it like a index of a book - a place to refer to! Make sure the index file exports an object with values of the data from that folder with the keys:

- `topicData`
- `articleData`
- `userData`
- `commentData`

As `.env.*` is added to the `.gitignore`, anyone who wishes to clone your repo will not have access to the necessary environment variables.
