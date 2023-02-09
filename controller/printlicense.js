const UserModel = require("../models/connection.js");

const printGet = (req, res) => {
    if (req.session && req.session.userid) {
        UserModel.findById(req.query.userid, (e, user) => {
            const userDob = new Date(user.dob);
            console.log(user);
            res.render("printlicense", {
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

const printPost = (req, res) => {
    console.log(req.body)
    UserModel.findByIdAndUpdate(
        req.body.id,
        {
            isPrinted: true,
        },
        {
            new: true,
        },
        (e, data) => {
            res.render("printlicense", {
                userid: req.session.userid,
                usertype: req.session.usertype,
                data: `${data.firstname} ${data.lastname}`,
            });
        }
    );
    
};

module.exports = { printGet, printPost };