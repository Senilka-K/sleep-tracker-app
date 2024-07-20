const mongoose = require("mongoose");

const formDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  occupation: { type: String, required: true },
});

const FormDetail = mongoose.model("FormDetail", formDetailsSchema);

module.exports = FormDetail;
