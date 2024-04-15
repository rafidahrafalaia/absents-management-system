require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const config = require('./config');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');
const db = require("./database/connection");
const app = express();
const port = process.env.PORT || 3002;
const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", employeeRoutes, authRoutes)

db.sequelize.sync(
  // {
  //   force: true
  // }
).then(() => {
  console.log("re-sync db.");
});

app.listen(port, () => {
  console.log("running server");
});