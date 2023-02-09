const bcrypt = require("bcrypt");
const UserModel = require("../models/connection.js");

const loginGet = (req, res) => {
  res.render("login", {
    userid: (req.session && req.session.userid) || null,
    usertype: (req.session && req.session.usertype) || null,
  });
};

const loginPost = (req, res) => {
  UserModel.findOne(
    {
      userid: req.body.userid,
    },
    (e, user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (e, same) => {
          if (same) {
            req.session.userid = user.id;
            req.session.usertype = user.usertype;
            res.redirect("/");
          } else {
            res.redirect("/login");
          }
        });
      } else {
        res.redirect("/signup");
      }
    }
  );
};

module.exports = { loginGet, loginPost };
