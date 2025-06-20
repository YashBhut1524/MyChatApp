import mongoose from "mongoose";
import { genSalt, hash } from "bcryptjs";

// Define a sub-schema for the colors object
const colorsSchema = new mongoose.Schema({
    bgColor: { type: String, required: false },
    textColor: { type: String, required: false },
    borderColor: { type: String, required: false },
}, { _id: false });  // Disable _id for the sub-schema since it's just a nested object

// Main user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    colors: {
        type: colorsSchema,  // Include the colors sub-schema here
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    }
});

// Hash the password before saving the user
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {  // Only hash if the password is modified
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
