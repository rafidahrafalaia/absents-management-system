require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const config = require('./config')
const app = express();
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const db = require("./database/connection");

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3001","http://localhost:3003","http://localhost:3004"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", adminRoutes, authRoutes)

db.sequelize.sync(
  // {
  //   force: true
  // }
).then(() => {
  console.log("re-sync db.");
});

app.listen(3003, () => {
  console.log("running server");
});
