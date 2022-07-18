const express = require("express");

const PORT = 3001;

const app = express();

let hashes = ['a', 'b', 'c', 'd', 'e'];

app.get('/hashes', (req, res) => {
  res.json(hashes);
});

app.post('/hashes', (req, res) => {
  const hash = req.body;

  console.log(hash);
  hashes.push(book);

  res.send("Hash has been added to the database");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});