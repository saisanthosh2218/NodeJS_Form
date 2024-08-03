const express = require("express");
const app = express();
const router = express.Router();
const Person = require("../models/personmodel");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: "50mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    return cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post("/store", upload.single("profileImage"), async (req, res) => {
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
      res.status(200).json({ message: "SignUp Successfull", redirect: true });
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
      bcrypt.compare(password, user.password, (err, ressponse) => {
        if (ressponse) {
          return res.status(200).json({ message: "correct" });
        }
      });

      // if (await user.comparePassword(password)) {
      //   return res
      //     .status(200)
      //     .json({ message: "correct username or password" });
      // } else {
      //   return res
      //     .status(401)
      //     .json({ message: "Incorrect username or Password" });
      // }
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

router.patch("/change/:username", async (req, res) => {
  const { username } = req.params;
  const data = req.body;
  // const userd = req.params.id;

  try {
    const user = await Person.findOne({ username });
    if (user) {
      const updated = await Person.findOneAndUpdate({ username }, data, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ updated });
    } else {
      console.log("user not found in database");
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

router.delete("/delete/:username", async (req, res) => {
  const { username } = req.params;
  const data = req.body;

  const personfound = await Person.findOne({ username });

  try {
    if (personfound) {
      const deletedUser = await Person.findOneAndDelete({ username }, data);
      res
        .status(200)
        .json({ message: "person deleted successfully", redirect: true });
    } else {
      res.status(400).json({ message: "person deleted unsuccessfully" });
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
