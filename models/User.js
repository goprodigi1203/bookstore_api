
const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

UserSchema.methods.generateToken = function () {
    return jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        process.env.SECRETKEY,
        { expiresIn: '1h' }
    );
};

const User = mongoose.model('User', UserSchema);

function validateRegisterUser(obj) {
    return Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        username: Joi.string().trim().min(5).max(100).required(),
        password: passwordComplexity().required(),
    }).validate(obj);
}

function validateLoginUser(obj) {
    return Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: passwordComplexity().required(),
    }).validate(obj);
}

function validateUpdateUser(obj) {
    return Joi.object({
        email: Joi.string().trim().min(5).max(100).email(),
        username: Joi.string().trim().min(5).max(100),
        password: passwordComplexity(),
    }).validate(obj);
}

function validateChangePassword(obj) {
    return Joi.object({
        password: passwordComplexity(),
    }).validate(obj);
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateChangePassword,
};