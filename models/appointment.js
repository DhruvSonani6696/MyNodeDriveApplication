const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AppointmentSchema = new Schema({
  bookingDate: Date,
  slot: String,
  isBooked: Boolean
});

const AppointmentModel = mongoose.model(
  "AppointmentModel",
  AppointmentSchema,
  "appointments"
);

module.exports = AppointmentModel;
