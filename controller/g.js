const UserModel = require("../models/connection.js");
const AppointmentModel = require("../models/appointment.js");
const gGet = async (req, res) => {

  const appointmentDate = req.query.adate ? new Date(req.query.adate.replace(/-/g, '\/')) : new Date();
  const booking = await AppointmentModel.find({
    bookingDate: appointmentDate,
  });

  let availableDateAndSlot = {
    bookingDate: appointmentDate.toISOString().split('T')[0],
    slots: []
  };

  if (booking.length > 0) {
    availableDateAndSlot = {
      bookingDate: new Date(booking[0].bookingDate).toISOString().split('T')[0],
      slots: booking.reduce((slots, currSlot) => {
        if (!currSlot.isBooked) {
          slots.push({ time: currSlot.slot, isBooked: currSlot.isBooked });
        }
        return slots;
      }, [])
    };
  }

  console.log('availableDateAndSlot', availableDateAndSlot)
  if (req.session.userid) {
    UserModel.findById(req.session.userid).populate("appointmentId").exec(function (e, user) {
      console.log(user);
      if (user) {
        res.render("G", {
          user: { ...user.toJSON(), dob: user.dob.toISOString().split('T')[0] },
          data: null,
          userid: req.session.userid,
          usertype: req.session.usertype,
          availableDateAndSlot
        });
      } else {
        res.render("G", {
          data: null,
          user: null,
          userid: req.session.userid,
          usertype: req.session.usertype,
          availableDateAndSlot
        });
      }
    });
  }
};


const gPost = async (req, res) => {

  const user = await UserModel.findById(req.session.userid).populate("appointmentId").exec();
  if(user.appointmentId) {
    const appointData = await AppointmentModel.findOne({bookingDate: new Date(user.appointmentId.bookingDate), slot: user.appointmentId.slot });
    await AppointmentModel.findByIdAndUpdate(appointData.id, {
      isBooked: false
    });
  }

  const newAppointmentData = await AppointmentModel.findOne({bookingDate: new Date(req.body.appointmentDate.replace(/-/g, '\/')), slot: req.body.slottime });
  
  if(newAppointmentData) {
    await AppointmentModel.findByIdAndUpdate(newAppointmentData.id, {
      isBooked: true
    });
  }

  UserModel.findByIdAndUpdate(
    req.session.userid,
    {
      ...req.body,
      dob: new Date(req.body.dob),
      appointmentId: newAppointmentData ? newAppointmentData.id : null,
      testType: "G",
      comment: '',
      status: '',
      isPrinted: false
    },
    { new: true },
    (e,user) => {
      console.log(user);
      res.redirect("/G");
    }
  );
};

module.exports = { gGet, gPost };
