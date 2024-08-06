const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require('child_process');
const User = require("./Models/Users");
const FormDetails = require("./Models/FormDetails");
const SleepData = require("./Models/Sleep");

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));


// User login endpoint
app.post("/login", async (req, res) => {
    console.log(req.body);
    const { username } = req.body;
    try {
      const user = await User.findOne({ username: username });
      if (user) {
        console.log(user.id);
        res.status(200).json({ message: "Login successful", user: user.id });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error });
    }
  });

// Form Data entering endpoint
app.post('/formDetails', async (req, res) => {
const { userId, name, age, gender, occupation } = req.body;

try {
    const newDetail = new FormDetails({
    userId,
    name,
    age,
    gender,
    occupation
    });

    await newDetail.save();
    res.status(201).send(newDetail);
} catch (error) {
    res.status(400).send(error);
}
});

// Check form status endpoint
app.post("/check-form-status", async (req, res) => {
    const { userId } = req.body;
    try {
      const formExists = await FormDetails.exists({ userId: userId });
      res.json({ formFilled: !!formExists }); 
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error checking form status", error: error.message });
    }
  });

// Endpoint to update sleep time
app.post('/update-sleep-time', async (req, res) => {
    const { userId, sleepTime } = req.body;
    try {
      const result = await FormDetails.findOneAndUpdate(
        { userId: userId },
        { $set: { sleepTime: new Date(sleepTime) } },
        { new: true, upsert: true }
      );
      res.status(200).json({ message: 'Sleep time updated', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Error updating sleep time', error: error });
    }
});

// Endpoint to update wake up time
app.post('/update-wake-up-time', async (req, res) => {
    const { userId, wakeUpTime } = req.body;
    try {
      const result = await FormDetails.findOneAndUpdate(
        { userId: userId },
        { $set: { wakeUpTime: new Date(wakeUpTime) } },
        { new: true, upsert: true }
      );
      res.status(200).json({ message: 'Wake up time updated', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Error updating wake up time', error: error });
    }
});


// GET endpoint to retrieve sleep and wake times
app.get('/times/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const Times = await FormDetails.findOne({ userId: userId });
      if (!Times) {
        return res.status(404).json({ message: "User not found" });
      }
      const times = {
        sleepTime: Times.sleepTime,
        wakeUpTime: Times.wakeUpTime
      };
      res.json(times);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user times", error: error.message });
    }
  });

// POST endpoint to update sleep and wake times
app.post('/update-times/:userId', async (req, res) => {
    const { userId } = req.params;
    const { sleepTime, wakeUpTime } = req.body;
    try {
        const updated = await FormDetails.findOneAndUpdate(
            { userId: userId },
            { $set: { sleepTime: new Date(sleepTime), wakeUpTime: new Date(wakeUpTime) } },
            { new: true }
        );
        if (updated) {
            res.status(200).json({ message: "Times updated successfully", data: updated });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating times", error: error.message });
    }
});

// Getting already filled formData endpoint
app.post("/formData", async (req, res) => {
    const { userId } = req.body;
    try {
      const formData = await FormDetails.findOne({ userId: userId });
      if (!formData) {
        return res
          .status(404)
          .json({ message: "Form data not found for the given user ID" });
      }
      res.json(formData);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving form data", error: error.message });
    }
});

// Form delete endpoint
app.delete("/delete-form", async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const result = await FormDetails.findOneAndDelete({ userId: userId });
      if (!result) {
        return res
          .status(404)
          .json({ message: "Form data not found for the given user" });
      }
      res.status(200).json({ message: "Form data deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error deleting form data", error: error.message });
    }
  });

// Form edit endpoint
app.put("/edit-form", async (req, res) => {
    const { userId } = req.body;
    console.log(userId);
    try {
      const formData = await FormDetails.findOne({ userId: userId });
      if (!formData) {
        return res
          .status(404)
          .json({ message: "Form data not found for the given user ID" });
      }
      formData.name = req.body.name || formData.name;
      formData.age = req.body.age || formData.age;
      formData.gender = req.body.gender || formData.gender;
      formData.occupation = req.body.occupation || formData.occupation;  
      await formData.save();
      res.status(200).json({ message: "Form updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating form data", error: error.message });
    }
  });

  // Sleep Endpoint
  app.post('/sleep', async (req, res) => {
    try {
      const { userId } = req.body;
      const newSleepRecord = new SleepData({
        userId: userId,
        sleepTime: new Date() // Record the current time as sleep time
      });
  
      await newSleepRecord.save();
      res.status(201).json(newSleepRecord);
    } catch (error) {
      res.status(500).json({ message: "Failed to record sleep time", error: error.message });
    }
  });

// Wake up endpoint
app.put('/wake/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sleepRecord = await SleepData.findOne({
      userId: userId,
      wakeUpTime: { $exists: false },    // Ensures no wakeUpTime is recorded
      sleepDuration: { $exists: false }, // Ensures no sleepDuration is recorded
      sleepQuality: { $exists: false }   // Ensures no sleepQuality is recorded
    });
    const formDetails = await FormDetails.findOne({ userId: userId }, 'age gender');

    if (!sleepRecord) {
      return res.status(404).json({ message: "Sleep record not found or wake-up time already recorded." });
    }

    sleepRecord.wakeUpTime = new Date(); // Record current time as wake-up time
    sleepRecord.sleepDuration = new Date(sleepRecord.wakeUpTime - sleepRecord.sleepTime); // Calculate duration
    await sleepRecord.save();

    const temp = {
      sleepDuration: sleepRecord.sleepDuration,
      age: formDetails.age,
      gender: formDetails.gender,
      stressLevel: 2,
      bmiCategory: 3,
      heartRate: 77,
      bloodPressure: "126/83"
    };

    const child = spawn('python3', ['../Model/model.py', JSON.stringify(temp)]);
    let output = "";

    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    child.on('close', async (code) => {
      console.log(`Child process exited with code ${code}`);
      if (code === 0) {
        try {
          const result = JSON.parse(output.trim());
          // Ensure result.sleepQuality is parsed as an integer
          sleepRecord.sleepQuality = parseInt(result.sleepQuality);
          await sleepRecord.save();
          res.status(200).json({ message: "Success", data: result });
        } catch (parseError) {
          console.error('Error parsing output from Python script:', parseError);
          res.status(500).json({ message: "Failed to parse model output", error: parseError.message });
        }
      } else {
        res.status(500).json({ message: "Failed to execute model script", error: output.trim() });
      }
    });


  } catch (error) {
    res.status(500).json({ message: "Failed to update wake-up time", error: error.message });
  }
});

// GET endpoint to fetch the latest sleep quality and last 7 sleep durations for a specific user
app.get('/sleep-quality/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const sleepRecords = await SleepData.find({ userId: userId })
      .sort({ wakeUpTime: -1 }) // Sort by wakeUpTime in descending order
      .limit(7) // Limit to the last 7 records
      .select('sleepDuration wakeUpTime sleepTime sleepQuality') // Include sleepQuality
      .exec();

    if (sleepRecords.length === 0) {
      return res.status(404).json({ message: "No sleep records found for this user." });
    }

    const sleepData = sleepRecords.map(sleep => ({
      durationHours: ((sleep.wakeUpTime - sleep.sleepTime) / 3600000).toFixed(1),
      sleepQuality: sleep.sleepQuality,
      sleepDate: sleep.sleepTime.toISOString().substring(0, 10)
    }));

    res.status(200).json({
      lastSleepData: sleepData
    });
  } catch (error) {
    console.error("Failed to retrieve sleep data:", error);
    res.status(500).json({ message: "Error retrieving sleep data", error: error.message });
  }
});

  // Listen on a port
const PORT = process.env.PORT || 5080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));