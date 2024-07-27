const express = require("express");
const router = express.Router();
const Person = require("../models/personmodel");

router.post("/store", async (req, res) => {
  const { FirstName, LastName, username, email, password } = req.body;

  const response = await Person.create({
    username: username,
    email: email,
    password: password,
    FirstName: FirstName,
    LastName: LastName,
  });

  try {
    if (response) {
      res.status(200).json({ message: "SignUp Successfull" });
    } else {
      res
        .status(400)
        .json({ message: "SignUp Failed Please Check Your Credentials" });
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
        res.status(200).json({
          data: user,
          Message: "Login Successful",
          redirect: true,
        });
      } else {
        res.status(400).json({ Message: "Incorrect Password" });
      }
    } else {
      res.status(400).json({
        Message: "Unable To Find User. Please Check Your Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/change", async (req, res) => {
  const { username } = req.body;
  const data = req.body;
  // const userd = req.params.id;

  try {
    const user = await Person.findOne({ username });
    if (user) {
      const updated = await Person.findOneAndUpdate({ username }, data, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ log: "user updated" });
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
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

router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  const personfound = await Person.findByIdAndDelete(id);

  console.log(personfound);
  try {
    if (!personfound) {
      res.status(400).json({ message: "Cannot found the person" });
    } else {
      res.status(200).json({ message: "person deleted successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/user/:id", async (req, res) => {
  const ver = req.params.id;
  const newContent = req.body;

  console.log(ver);

  const personChange = await Person.findByIdAndUpdate(ver, newContent);
  console.log(personChange);
  try {
    if (personChange) {
      res.status(200).json({ message: "Person data has changed" });
    } else {
      res.status(400).json({ message: "Cannot find the person" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
