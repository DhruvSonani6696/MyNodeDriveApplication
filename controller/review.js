const UserModel = require("../models/connection.js");

const reviewGet = (req, res) => {
    if (req.session && req.session.userid) {
        UserModel.findById(req.query.userid, (e, user) => {
            const userDob = new Date(user.dob);
            console.log(user);
            res.render("reviewprofile", {
                userid: req.session.userid,
                usertype: req.session.usertype,
                data: {
                    ...user.toJSON(),
                    dob: userDob.toISOString().split('T')[0],
                },
            });
        });
    } else {
        res.redirect("/");
    }
};

const reviewPost = (req, res) => {
    console.log(req.body)
    if (
        req.body.status &&
        req.body.comment
    ) {
        UserModel.findByIdAndUpdate(
            req.body.id,
            {
                ...req.body,
            },
            {
                new: true,
            },
            (e, data) => {
                res.render("reviewprofile", {
                    userid: req.session.userid,
                    usertype: req.session.usertype,
                    data: "Data updated",
                });
            }
        );
    } else {
        res.render("reviewprofile", {
            userid: req.session.userid,
            usertype: req.session.usertype,
            data: "Result and comments are mandatory",
        });
    }
};

module.exports = { reviewGet, reviewPost };