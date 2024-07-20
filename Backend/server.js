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

  // Listen on a port
const PORT = process.env.PORT || 5080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));