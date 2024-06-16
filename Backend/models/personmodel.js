const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  username: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: { type: String },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
