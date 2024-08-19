const express = require("express");
const app = express();
const router = express.Router();
const Person = require("../models/personmodel");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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
          return res.status(200).json({ message: "Login Successfull" });
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

router.post("/password/retrive", async (req, res) => {
  const { email } = req.body;

  const findPerson = await Person.findOne({ email });

  if (!findPerson) {
    res.status(400).json({ message: "Cannot find Person" });
  } else {
    try {
      const token = jwt.sign({ _id: findPerson.id }, "jwt_secret_key", {
        expiresIn: "1h",
      });

      console.log(findPerson._id);

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_GMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.MY_GMAIL,
        to: email,
        subject: "Reset Password Link",
        text: `http://127.0.0.1:5500/Frontend/pages/reset_Password.html?/${findPerson.id}/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).json({ message: "Reset Link Sent Your Mail" });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post("/reset_password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    jwt.verify(token, "jwt_secret_key", async (err, decode) => {
      if (err) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }

      // console.log(decode);

      // Check if the token's user ID matches the requested ID
      if (decode._id !== id) {
        return res
          .status(400)
          .json({ message: "Invalid token for this user." });
      }

      const user = await Person.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.password = password;
      await user.save();

      res
        .status(200)
        .json({ message: "Password has been reset successfully." });
    });
  } catch (error) {
    console.log(error);
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
