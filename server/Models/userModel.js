const mongoose = require('mongoose'),
    validator = require('validator'),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto');

/**
 * Mongoose schema for user accounts, including authentication and profile fields.
 */
const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Firstname is required!"],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, "Lastname is required!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Please provide a valid email!"],
        unique: true,
        trim: true
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Password is required!"],
        minlength: [8, "Password must be at least 8 characters!"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password!"],
        validate: {
            validator: function (value) {
                // 'this' refers to the current document being validated
                return value === this.password;
            },
            message: "Passwords do not match!"
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "dev"]
    },
    createdAt: {
        default: Date.now,
        type: Date
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    dateOfBirth: Date
});

// HASH PASSWORD
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
});

// QUERY MIDDLEWARE - Filter out inactive users
userSchema.pre(/^find/, function () {
    this.find({ active: { $ne: false } });

});


// Validate user password
userSchema.methods.ValidateUserPassword = async function (password, hash) {
    return await bcrypt.compare(password, hash);
}

// Verify if pasword is updated after token is issued
userSchema.methods.isPasswordModified = async function (jwtIssueTime) {
    if (this.passwordChangedAt) {

        const passwordChangeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return (passwordChangeTime > jwtIssueTime);
    }
    return false;
}

// Generate Random Password Reset Token
userSchema.methods.generatePasswordResetToken = function () {
    // Generate Random Token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and store in DB
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + (5 * 60 * 1000); // Token expires 5 minutes after issued

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;