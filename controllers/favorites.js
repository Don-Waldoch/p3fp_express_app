const express = require('express')
const favorites = express.Router()
const { db } = require("../utils/dbConnection");

///////////////////////////////////////////////////////////////////////
// CRUD Routes
//
//console.log("req", req);
//console.log("req body", req.body);
//const response = {"status" : "OK"};
  //
  // const response = {
  //  "email"     : req.body.email,
  //  "firstname" : req.body.firstname,
  //  "lastname"  : req.body.lastname,
  //  "passhash"  : req.body.passhash,
  // };
  // res.status(200).json(response);
  //
//

favorites.get("/:userid", async (req, res) => {
  const response = await queryToFetchFavorites(req.params.userid);
  res.status(200).json(response);
});

favorites.post("/", async (req, res) => {
  try {
    const response = await queryToAddFavorite(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

///////////////////////////////////////////////////////////////////////
// Queries

queryToAddFavorite = (body) => {
  return db.one(
    `
    INSERT INTO favorites (userid, exerciseid)
    VALUES ($/userid/, $/exerciseid/)
    RETURNING favoriteid, userid, exerciseid
    `,
    { ...body }
  );
}

queryToFetchFavorites = (userid) => {
  return db.manyOrNone(
    `SELECT favoriteid, userid, exerciseid FROM favorites WHERE userid = '${userid}'`
  );
}

module.exports = favorites;
