require("dotenv").config();
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find the highest employee number
    const lastUser = await User.findOne().sort({ employeeNumber: -1 });
    const highestEmployeeNumber = lastUser ? lastUser.employeeNumber : 999; // start from 999 so the next will be 1000

    // Hash the password
    const salt = await bcrypt.genSalt(10); // 10 rounds is generally considered as a safe value
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
      name,
      email,
      employeeNumber: highestEmployeeNumber + 1,
      password: hashedPassword, // store the hashed password, not the plain one
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({
      message: "User created",
      userName: newUser.name,
      userEmail: newUser.email,
      userId: newUser._id,
      employeeNumber: newUser.employeeNumber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, employeeNumber } = req.body;

    // Check if the user exists
    const user = await User.findOne({ employeeNumber });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid employee Number or password" });
    }
    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Invalid employee Number or password" });
    }
    const AccountActive = user.verified;
    if (!AccountActive) {
      return res.status(400).json({ message: "Account not activated" });
    }

    const token = jwt.sign(
      { _id: user._id, employeeNumber: user.employeeNumber },
      process.env.TOKEN_SECRET
    );
    res.status(200).json({
      message: "Login successful",
      token,
      userName: user.name,
      userEmail: user.email,
      userId: user._id,
      employeeNumber: user.employeeNumber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
