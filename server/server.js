const express = require("express");
const Gun = require('gun');

const PORT = 3001;
const app = express();
app.use(Gun.serve);

const server = app.listen(PORT, () => {
  console.log("Listening at: http://localhost:" + PORT + "/gun");
})

Gun({ file: 'db/data', web: server });