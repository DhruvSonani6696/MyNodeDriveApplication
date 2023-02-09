const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://dsonani1641:dsonani1641@cluster1.8ifprx7.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

mongoose.connection.on("connected", () => {
  console.log("Application is connected to database");
});

const UserSchema = new mongoose.Schema({
  firstname: "String",
  lastname: "String",
  userid: "String",
  password: "String",
  usertype: "String",
  dob: {
    type:Date,
    default:Date.now
  },
  address: "String",
  cardetails: "String",
  licensenumber: "String",
  image: "String",
  testType: "String",
  comment: "String",
  status: "String",
  isPrinted: "Boolean",
  appointmentId: { type: mongoose.Types.ObjectId, ref:'AppointmentModel'}
});

UserSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 7).then((ep) => {
    this.password = ep;
    next();
  });
});

const UserModel = new mongoose.model("UserModel", UserSchema, "users");
module.exports = UserModel;
