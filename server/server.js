const express = require("express");
const keccak256 = require('keccak256')

const PORT = 3001;
const app = express();
app.use(express.json());

let hashes = [];

app.get('/hashes', (req, res) => {
  res.json(hashes);
});

app.post('/hash', (req, res) => {
  const hash = req.body;
  console.log(hash);
  hashes.push(hash);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});