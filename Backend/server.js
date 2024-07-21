const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./Models/Users");
const FormDetails = require("./Models/FormDetails");

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

  // Listen on a port
const PORT = process.env.PORT || 5080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));