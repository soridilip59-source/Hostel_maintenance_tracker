require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const [, , nameArg, emailArg, passwordArg] = process.argv;
const name = nameArg?.trim();
const email = emailArg?.trim().toLowerCase();
const password = passwordArg;

async function createAdmin() {
  if (!name || !email || !password) {
    throw new Error("Usage: npm run create-admin -- \"Name\" email@example.com password");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Please provide a valid email address");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { name, password: passwordHash, role: "admin" },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin account is ready: ${user.email}`);
}

createAdmin()
  .catch((error) => {
    console.error(`Could not create admin: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
