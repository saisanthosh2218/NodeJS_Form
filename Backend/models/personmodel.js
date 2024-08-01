const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  FirstName: { type: String },
  LastName: { type: String },

  username: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: { type: String },

  file: { type: String },
});

const Person = mongoose.model("signupusers", personSchema);

module.exports = Person;
