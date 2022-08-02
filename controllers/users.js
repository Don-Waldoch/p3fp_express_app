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

module.exports = users
