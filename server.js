require("dotenv").config();
const { PORT } = process.env;
const cors = require("cors");
const express = require("express");
const app = express();
const routes = require('./routes/index.js')

app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json());


app.use('/', routes)
app.use((req, res) => {res.status(404).json({message: "NOT A PROPER ROUTE"})})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));