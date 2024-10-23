import { compareSync } from "bcrypt";
import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";
import fs from 'fs';
import path from 'path';

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check if the email is already registered
                // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email is already registered" });
        }
        // Create new user
        const userData = new User({ email, password });
        const savedData = await userData.save();
        // Create JWT token and set cookie
        res.cookie("jwt", createToken(savedData.email, savedData._id), {
            httpOnly: true, // Prevent access from client-side scripts
            maxAge,
            secure: true, // Only allow sending via HTTPS in production
            sameSite: "None", // Required for cross-origin requests in modern browsers
        });
        // Send success response
        return res.status(201).json({
            msg: "User successfully created",
            user: {
                id: savedData._id,
                email: savedData.email,
                profileSetup: savedData.profileSetup,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!!" });
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required!!" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User with given email is not found!!" });
        const auth = await compareSync(password, user.password)
        if(!auth) return res.status(400).json({msg: "Password is Incorrect!!"})
        res.cookie("jwt", createToken(email, user.id), {
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return res.status(200).send({
            msg: "Successfully LoggedIn",
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                colors: user.colors,
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error!!"})
    }
}

export const getUserInfo = async (req, res) => {
    try {
        // console.log(req.userId);
        const userData = await User.findById(req.userId)
        if(!userData) return res.status(404).send("User with the given ID Not Found!!")
        return res.status(200).json({
            msg: "Successfully LoggedIn",
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            colors: userData.colors,
        })        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error!!"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        const { firstName, lastName, colors } = req.body;
        // Validate firstName, lastName, and colors are provided
        if (!firstName || !lastName) {
            return res.status(400).json({ error: "FirstName and LastName are required!" });
        }
        // Find and update the user in the database
        const userData = await User.findByIdAndUpdate(
            userId, 
            {
                firstName, 
                lastName, 
                colors: colors,  // Make sure to pass the colors object here
                profileSetup: true
            },
            {
                new: true, 
                runValidators: true
            }
        );
        if (!userData) {
            return res.status(404).json({ error: "User not found!" });
        }
        // Respond with updated user data
        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            colors: userData.colors,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const addProfileImage = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).send("File is Required!!")
        }
        const date = Date.now()
        let fileName = ("uploads/profiles/" + date + req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'))
        renameSync(req.file.path, fileName)

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {image: fileName},
            {new: true, runValidators: true}
        )
        return res.status(200).json({
            image: updatedUser.image
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const removeProfileImage = async (req, res) => {
    try {
        const {userId} = req
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({msg: "User Not Found"})
        if(user.image) {
            unlinkSync(user.image)
        }
        user.image = null;
        await user.save()

        return res.status(200).send("Profile Image removed Sucessfully")
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1, secure:true, sameSite: "None"})
        res.status(200).json({ error: "Logout Successfull." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
}

