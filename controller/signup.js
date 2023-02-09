const UserModel = require("../models/connection.js");

const signupGet = (req, res) => {
  res.render("signup", {
    msg: null,
    userid: (req.session && req.session.userid) || null,
    usertype: (req.session && req.session.usertype) || null,
  });
};

const signupPost = (req, res) => {
  if (req.body.password == req.body.repeatedpassword) {
    UserModel.findOne({ userid: req.body.userid }, function (e, data) {
      console.log(req.body);
      console.log(data);
      if (!data) {
        UserModel.create(
          {
            ...req.body,
          },
          (e, user) => {
            console.log(user);
            if (user) {
              res.redirect("/login");
            }
          }
        );
      } else {
        res.render("signup", {
          msg: "Username is already exist",
          userid: (req.session && req.session.userid) || null,
          usertype: (req.session && req.session.usertype) || null,
        });
      }
    });
  } else {
    res.render("signup", {
      msg: "Password and Repeat password is not same",
      userid: (req.session && req.session.userid) || null,
      usertype: (req.session && req.session.usertype) || null,
    });
  }
};

module.exports = { signupGet, signupPost };
