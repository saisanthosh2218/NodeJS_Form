const express = require("express");
const router = express.Router();
const Person = require("../models/personmodel");

router.post("/store", async (req, res) => {
  const { username, email, password } = req.body;

  const response = await Person.create({
    username: username,
    email: email,
    password: password,
  });

  try {
    if (response) {
      res.status(200).json({ message: "Successfully stored" });
    } else {
      res.status(400).json({ message: "Data is not stored" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Person.findOne({ email: email });

    if (user) {
      if (user.password === password) {
        res.status(200).json({ message: "login successful" });
      } else {
        res.status(400).json({ message: "password wrong" });
      }
    } else {
      res.status(400).json({ message: "Cannot find email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  const data = await Person.find({});

  try {
    if (data) {
      res.status(200).json(data);
    } else {
      console.log("cannot find data");
    }
  } catch (error) {
    console.log("error");
  }
});

module.exports = router;
