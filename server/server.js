const express = require("express");

const PORT = 3001;
const app = express();
app.use(express.json());

let CIDs = [];

app.get('/CIDs', (req, res) => {
  res.json(CIDs);
});

app.post('/CID', (req, res) => {
  const newCID = req.body.CID;
  CIDs.push(newCID);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});