const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const bodyParser = require("body-parser");
const { dashboardGet } = require("./controller/dashboard");
const { loginGet, loginPost } = require("./controller/login");
const { signupGet, signupPost } = require("./controller/signup");
const { gPost, gGet } = require("./controller/g");
const { printGet, printPost } = require("./controller/printlicense");
const { g2Get, g2Post } = require("./controller/g2");
const { logoutGet } = require("./controller/logout");
const { reviewGet, reviewPost } = require("./controller/review");
const { appointmentGet, appointmentPost } = require("./controller/appointment");
const { isDriver, loggdIn, skipLogin, isAdmin, isExaminer } = require("./middleware.js");
const app = express();
const approuter = express.Router();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(
  session({
    secret: "DhruvkumarSonani",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("trust", 1);

app.use("/", approuter);

approuter.get("", dashboardGet);

approuter.get("/G", [loggdIn, isDriver], gGet);
approuter.post("/G", [loggdIn, isDriver], gPost);

approuter.get("/G2", [loggdIn, isDriver], g2Get);
approuter.post("/G2", [loggdIn, isDriver], g2Post);

approuter.get("/appointment", [loggdIn, isAdmin], appointmentGet);
approuter.post("/appointment", [loggdIn, isAdmin], appointmentPost);

approuter.get("/printlicense", [loggdIn, isAdmin], printGet);
approuter.post("/printlicense", [loggdIn, isAdmin], printPost);

approuter.get("/reviewprofile", [loggdIn, isExaminer], reviewGet);
approuter.post("/reviewprofile", [loggdIn, isExaminer], reviewPost);

approuter.get("/login", skipLogin, loginGet);
approuter.post("/login", skipLogin, loginPost);

approuter.get("/signup", skipLogin, signupGet);
approuter.post("/signup", skipLogin, signupPost);

approuter.get("/logout", loggdIn, logoutGet);

app.listen(4000, () => {
  console.log("Server running on port number 4000");
});