const mongoose = require("mongoose");

const sleepDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sleepTime: { type: Date },
  wakeUpTime: { type: Date },
  sleepDuration: { type: Date }
});

const SleepData = mongoose.model("SleepData", sleepDetailsSchema);

module.exports = SleepData;
