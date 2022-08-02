///////////////////////////////////////////////////////////////////////
// =======
// DEPENDENCIES
const express = require("express");
const cors = require('cors');
const path = require('path');

// CONFIGURATION
require('dotenv').config();
const app = express();

// MIDDLEWARE
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  var options = {
    root: path.join(__dirname)
  };
  var fileName = 'README.md';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });    
});

// Controllers:
const usersController = require("./controllers/users.js");
app.use("/users", usersController);

// LISTEN
app.listen(process.env.PORT, () => {
  console.log("Listening on port: ", process.env.PORT);
});
