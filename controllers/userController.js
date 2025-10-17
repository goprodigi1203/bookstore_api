const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");

module.exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
})

module.exports.getUserById = asyncHandler(async (req, res) => {
    const users = await User.findById(req.params.id).select("-password");
    if (users) {
        return res.status(200).json(users);
    } else {
        return res.status(404).json({ message: "User not found !" });
    }
})

module.exports.updateUser = asyncHandler(async (req, res) => {
    if (req.user._id !== req.params.id) {
        return res.status(403).json({ message: "You are not allowed !" })
    }

    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
        }
    }, { new: true }).select("-password");

    return res.status(200).json(updateUser);
});

module.exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "User deleted successfully !" })
    } else {
        return res.status(404).json({ message: "User not found !" })
    }
})