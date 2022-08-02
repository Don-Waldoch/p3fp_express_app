const express = require('express')
const users = express.Router()

const { db } = require("../utils/dbConnection");

///////////////////////////////////////////////////////////////////////
// CRUD Routes
//
//console.log("req", req)
  // const response = {
  //  "email"     : req.body.email,
  //  "firstname" : req.body.firstname,
  //  "lastname"  : req.body.lastname,
  //  "passhash"  : req.body.passhash
  // };
  // res.status(200).json(response);
//

users.post("/signin", async (req, res) => {
  try {
    const response = await queryToSignInUsers(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

users.post("/signup", async (req, res) => {
  try {
    const response = await queryToSignUpUsers(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Read Routes
users.get("/", async (req, res) => {
  try {
    const response = await queryToFetchUsers();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

users.get("/:email", async (req, res) => {
  const response = await queryToFetchUsers(req.params.email);
  res.status(200).json(response);
});

// Update Routes
users.put("/", async (req, res) => {
  try {
    const response = await queryToUpdateUsers(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Routes
users.delete("/:email", async (req, res) => {
  try {
    const response = await queryToDeleteUsers(req.params.email);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

///////////////////////////////////////////////////////////////////////
// Queries

queryToSignInUsers = (body) => {
  // console.log(body);
  return db.oneOrNone(
    `
    SELECT userid, email, firstname, lastname FROM users
    WHERE email = '${body.email}' AND passhash = '${body.passhash}'
    `
  );
}

queryToSignUpUsers = (body) => {
  // console.log(body)
  return db.one(
    `
    INSERT INTO users (email, firstname, lastname, passhash)
    VALUES ($/email/, $/firstname/, $/lastname/, $/passhash/)
    RETURNING userid, email, firstname, lastname
    `,
    { ...body }
  );
}

queryToFetchUsers = (email) => {
  if (email === undefined) {
    return db.manyOrNone(
      'SELECT userid, email, firstname, lastname FROM users'
    );
  } else {
    return db.oneOrNone(
      `SELECT userid, email, firstname, lastname FROM users WHERE email = '${email}'`
    );
  }
}

queryToUpdateUsers = (body) => {
  //console.log(body)
  return db.one(
    `
    UPDATE users SET
    firstname = $/firstname/,
    lastname = $/lastname/,
    passhash = $/birthdate/
    WHERE email = $/email/
    RETURNING userid, email, firstname, lastname
    `,
    { ...body }
  );
}

queryToDeleteUsers = (email) => {
  //console.log(email)
  return db.result(
    'DELETE FROM users WHERE email = $1', email, a => a.rowCount
  );
}

module.exports = users
