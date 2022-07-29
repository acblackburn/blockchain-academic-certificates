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
  const hash = Buffer.from(req.body);
  const hash_string = hash.toString('hex');
  hashes.push(hash_string);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});