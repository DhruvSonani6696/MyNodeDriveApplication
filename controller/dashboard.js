const UserModel = require("../models/connection.js");
const AppointmentModel = require("../models/appointment.js");

const dashboardGet = async (req, res) => {
  console.log(req.session)
  if (req.session && req.session.usertype == 'driver') {
    const user = await UserModel.findById(req.session.userid).populate("appointmentId").exec();
    const userDob = new Date(user.dob);

    let appointData = null;
    if (user.appointmentId) {
      appointData = await AppointmentModel.findOne({ bookingDate: new Date(user.appointmentId.bookingDate), slot: user.appointmentId.slot });
    }

    console.log(user);
    res.render("index", {
      userid: (req.session && req.session.userid) || null,
      usertype: (req.session && req.session.usertype) || null,
      data: {
        ...user.toJSON(),
        dob: userDob.toISOString().split('T')[0],
        appointmentDate: appointData && appointData.bookingDate.toISOString().split('T')[0],
        appointmentTime: appointData && appointData.slot,
      }
    });
  } else if (req.session && req.session.usertype == 'examiner') {
    const users = await UserModel.find({ usertype: 'driver', testType: (req.query.status && req.query.status != 'all' ? req.query.status.toUpperCase() : { $ne: null }), appointmentId: { $ne: null } }).populate("appointmentId").exec();
    console.log(users);


    const userList = await Promise.all(users.map(async val => {
      let appointData = null;
      if (val.appointmentId) {
        appointData = await AppointmentModel.findOne({ bookingDate: new Date(val.appointmentId.bookingDate), slot: val.appointmentId.slot });
      }
      return {
        name: `${val.firstname} ${val.lastname}`,
        testType: val.testType,
        carDetails: val.cardetails,
        licensenumber: val.licensenumber,
        status: val.status || 'Pending',
        appointment: `${appointData.bookingDate.toISOString().split('T')[0]} | ${appointData.slot}`,
        action: val.status ? 'action' : val.id
      }
    }));
    console.log(userList);
    res.render("index", {
      userid: (req.session && req.session.userid) || null,
      usertype: (req.session && req.session.usertype) || null,
      currentSelectedFilter: req.query.status,
      data: {
        headers: {
          name: 'Name',
          testType: 'Test type',
          carDetails: 'Car Details',
          licensenumber: 'License Number',
          status: 'Status',
          appointment: 'Appointment',
          action: 'Action'
        },
        rows: [...userList]
      }
    });
  } else if (req.session && req.session.usertype == 'admin') {
    const users = await UserModel.find({ usertype: 'driver', status: (req.query.status && req.query.status != 'all' ? req.query.status : { $ne: null }), appointmentId: { $ne: null } }).populate("appointmentId").exec();
    console.log(users);


    const userList = await Promise.all(users.map(async val => {
      let appointData = null;
      if (val.appointmentId) {
        appointData = await AppointmentModel.findOne({ bookingDate: new Date(val.appointmentId.bookingDate), slot: val.appointmentId.slot });
      }
      return {
        name: `${val.firstname} ${val.lastname}`,
        testType: val.testType,
        carDetails: val.cardetails,
        licensenumber: val.licensenumber,
        status: val.status || 'Pending',
        appointment: `${appointData.bookingDate.toISOString().split('T')[0]} | ${appointData.slot}`,
        action: val.status && val.status == 'pass' && !val.isPrinted ? val.id : 'action' 
      }
    }));
    console.log(userList);
    res.render("index", {
      userid: (req.session && req.session.userid) || null,
      usertype: (req.session && req.session.usertype) || null,
      currentSelectedFilter: req.query.status || null,
      data: {
        headers: {
          name: 'Name',
          testType: 'Test type',
          carDetails: 'Car Details',
          licensenumber: 'License Number',
          status: 'Status',
          appointment: 'Appointment',
          action: 'Action'
        },
        rows: [...userList]
      }
    });
  } else {
    res.render("index", {
      userid: (req.session && req.session.userid) || null,
      usertype: (req.session && req.session.usertype) || null,
      data: null
    });
  }
};

module.exports = { dashboardGet };
