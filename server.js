require("dotenv").config();
const { PORT, DATABASE_URL, SECRET_ACCESS_TOKEN } = process.env;
const cors = require("cors");
const express = require("express");
const app = express();
const routes = require('./routes/index.js');
const cookieParser = require("cookie-parser");

const allowedOrigins = [
    'https://localhost:5173',
    'https://memeql.com',
    'https://dev.memeql.com',
    // Add other origins as needed
]

const corsOptionsDelegate = (req, callback) => {
    let corsOptions
    if (allowedOrigins.includes(req.header('Origin'))) {
      corsOptions = { origin: true, credentials: true }
    } else {
      corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))
app.disable("x-powered-by")
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/', routes)
app.use((req, res) => {res.status(404).json({message: "NOT A PROPER ROUTE"})})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));