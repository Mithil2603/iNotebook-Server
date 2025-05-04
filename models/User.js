import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model('user', userSchema);

// Index: Handle index creation with async function
(async () => {
  try {
    await User.createIndexes();
    console.log("Indexes created for User model");
  } catch (err) {
    console.error("Error creating indexes: ", err.message);
  }
})();

export default User;