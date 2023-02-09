const logoutGet = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

module.exports = { logoutGet };
