const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require('cookie-parser');

dotenv.config();

const authRoutes = require("./routes/auth");
const roleRoutes = require("./routes/role");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use((req, res, next) => {
  res.locals.username = req.cookies.username || null;
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth.html"));
});

app.use("/api/auth", authRoutes);
app.use("/role", roleRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));