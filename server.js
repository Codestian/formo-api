const express = require("express");
const dotenv = require("dotenv");
const pgp = require("pg-promise")();

const app = express();
const port = process.env.API_PORT;

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const db = pgp(config);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CREATE
app.post("/notes", async (req, res) => {
  if (req.body.hasOwnProperty("title") && req.body.hasOwnProperty("body")) {
    const { title, body } = req.body;

    try {
      data = await db.none(
        "INSERT INTO db_formo.notes(title, body) VALUES($1, $2)",
        [title, body]
      );
      res.send({
        status: "success",
        message: "note has been added",
      });
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: err,
      });
    }
  } else {
    res.status(400).send({
      status: "error",
      message: "request must have title and body",
    });
  }
});

// READ
app.get("/notes", async (req, res) => {
  let searchQuery = "";
  let sortQuery = "asc";

  // TODO PREVENT SQL INJECTION BY CHECKING SPECIAL CHARACTERS IN URL

  // CHECK IF CLIENT HAS SEARCH QUERY, THEN RETURNS NOTES WITH TITLE MATCHING QUERY.
  if (req.query.search) {
    searchQuery = req.query.search;
  }

  // CHECKS IF CLIENT HAS SORT QUERY, THEN SORTS THE NOTES EITHER BY ASCENDING OR DESCENDING ORDER.
  if (req.query.sort === "desc" || req.query.sort === "asc") {
    sortQuery = req.query.sort;
  } else if (req.query.sort) {
    return res.status(400).send({
      status: "error",
      message: "Sort parameter query must either be 'desc' or 'asc'",
    });
  }

  try {
    data = await db.any(
      `SELECT * FROM db_formo.notes WHERE LOWER ( title ) LIKE '%${searchQuery}%' ORDER BY updated_at ${sortQuery}`,
      [true]
    );
    res.send({
      status: "success",
      message: data,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

// READ
app.get("/notes/:id(\\d+)/", async (req, res) => {
  try {
    data = await db.oneOrNone(
      "SELECT * FROM db_formo.notes WHERE id =" + req.params.id,
      [true]
    );

    if (data) {
      res.send({
        status: "success",
        message: data,
      });
    } else {
      res.status(404).send({
        status: "error",
        message: "note not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

// UPDATE
app.put("/notes/:id(\\d+)/", async (req, res) => {
  if (req.body.hasOwnProperty("title") && req.body.hasOwnProperty("body")) {
    const { title, body } = req.body;

    try {
      data = await db.none(
        "UPDATE db_formo.notes SET title = $1, body= $2 WHERE id = $3",
        [title, body, req.params.id]
      );

      res.send({
        status: "success",
        message: "note has been updated",
      });
    } catch (err) {
      res.status(500).send({
        status: "error",
        message: err,
      });
    }
  } else {
    res.status(400).send({
      status: "error",
      message: "request must have title and body",
    });
  }
});

// DELETE
app.delete("/notes/:id(\\d+)/", async (req, res) => {
  try {
    data = await db.none("DELETE FROM db_formo.notes WHERE id=$1", [
      req.params.id,
    ]);

    res.send({
      status: "success",
      message: "note has been deleted",
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
