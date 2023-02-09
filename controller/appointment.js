const AppointmentModel = require("../models/appointment.js");

const appointmentGet = (req, res) => {
    console.log(req.body);
    res.render('appointment', {
        userid: req.session.userid,
        usertype: req.session.usertype,
        msg: ""
    })
};

const appointmentPost = async (req, res) => {
    console.log(req.body);
    const bookingDate = req.body.bookingDate.replace(/-/g, '\/');
    const dates = await AppointmentModel.find({ bookingDate: new Date(bookingDate) });
    if (dates.length > 0) {
        if (Array.isArray(req.body.slots)) {
            const remainingSlots = req.body.slots.filter(slot => dates.findIndex(d => d.slot == slot) == -1);
            console.log('newSlots ::', remainingSlots)
            if (remainingSlots.length > 0) {
                const newSlots = remainingSlots.map(slot => ({ bookingDate: new Date(bookingDate), slot, isBooked: false }))
                await AppointmentModel.create(
                    ...newSlots
                );
            }
        } else {
            if (dates.findIndex(d => d.slot == req.body.slots) == -1) {
                await AppointmentModel.create({
                    bookingDate: new Date(bookingDate),
                    slot: req.body.slots,
                    isBooked: false
                });
            }
        }
        res.render('appointment', {
            userid: req.session.userid,
            usertype: req.session.usertype,
            msg: "Data has been updated"
        })
    } else {
        if (Array.isArray(req.body.slots)) {
            const newSlots = req.body.slots.map(slot => ({ bookingDate: new Date(bookingDate), slot, isBooked: false }))
            const a = await AppointmentModel.create(
                ...newSlots
            );
            console.log(a);
        } else {
            await AppointmentModel.create({
                bookingDate: new Date(bookingDate),
                slot: req.body.slots,
                isBooked: false
            });
        }
        res.render('appointment', {
            userid: req.session.userid,
            usertype: req.session.usertype,
            msg: "Data has been added"
        })
    }
};

module.exports = { appointmentGet, appointmentPost };
