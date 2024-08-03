const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

personSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    next();
  } catch (error) {
    console.log(error);
  }
});

personSchema.methods.comparePassword = async function (personPassword) {
  try {
    const isMatched = await bcrypt.compare(personPassword, this.password);
    return isMatched;
  } catch (error) {
    console.log(error);
  }
};

const Person = mongoose.model("signupusers", personSchema);

module.exports = Person;
