import mongoose from "mongoose";
import User from "../model/UserModel.js";
import Message from "../model/MessagesModel.js";

export const searchContacts = async (req, res, next) => {
    try {
        const { searchText } = req.body;
        if (searchText === undefined || searchText === null) {
            return res.status(400).json({ msg: "Search is not valid!" });
        }
        // Sanitize search text to prevent regex injection
        const sanitizedSearchText = searchText.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        // Create a case-insensitive regex
        const regex = new RegExp(sanitizedSearchText, "i");
        // Find contacts based on first name, last name, or email
        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } }, // Exclude the current user
                {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex }
                    ]
                }
            ]
        });
        res.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
    }
};

export const getContactsForDmList = async (req, res) => {
    try {
        let { userId } = req;

        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" }, // Correct placement of lastMessageTime
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo", // Ensure $unwind is wrapped properly
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    colors: "$contactInfo.colors",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            },
        ]);

        return res.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
    }
};

export const getAllContacts = async (req, res, next) => {
    try {
        const users = await  User.find({_id:{$ne:req.userId}}, "firstName lastName email _id")
        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName} ` : user.email,
            value: user._id,
        }))
        res.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
    }
};