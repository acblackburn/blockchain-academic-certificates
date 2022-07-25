const express = require("express");
const keccak256 = require('keccak256')

const PORT = 3001;
const app = express();
app.use(express.text());

let hashes = [];

app.get('/hashes', (req, res) => {
  res.json(hashes);
});

app.post('/hash', (req, res) => {
  const hash = req.body;

  console.log(hash + " -> " + keccak256(hash));
  hashes.push(String(keccak256(hash)));

  res.send("New hash has been added to the database");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});