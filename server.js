const express = require("express");
const app = express();

const path = require('path');

app.use(express.static(path.join(__dirname, "build")));

// CORS policy
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res)=>{
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'build/index.html'));
})

app.listen(3000, () => {
  console.log("server on");
});
