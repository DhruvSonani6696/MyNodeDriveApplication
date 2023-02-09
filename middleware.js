const loggdIn = function (req, res, next) {
  if (!req.session.userid) {
    res.redirect("/");
  } else {
    next();
  }
};

const isDriver = function (req, res, next) {
  if (req.session.usertype != "driver") {
    res.redirect("/");
  } else {
    next();
  }
};

const skipLogin = function (req, res, next) {
  if (req.session.userid) {
    res.redirect("/");
  } else {
    next();
  }
};

const isAdmin = function (req, res, next) {
  if (req.session.usertype != "admin") {
    res.redirect("/");
  } else {
    next();
  }
};

const isExaminer = function (req, res, next) {
  if (req.session.usertype != "examiner") {
    res.redirect("/");
  } else {
    next();
  }
};


module.exports = { loggdIn, skipLogin, isDriver, isAdmin, isExaminer };
