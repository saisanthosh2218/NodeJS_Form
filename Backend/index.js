const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv");
env.config();
const db = require("./mongoDB");
const Person = require("./models/personmodel");
app.use(cors());
app.use(express.json());

const port = 5885;

const getRoute = require("./routes/postRout");
app.use("/", getRoute);

app.listen(port, () => console.log(` listening on port ${port}!`));
