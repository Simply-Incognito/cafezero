"use strict";

const nodemailer = require("nodemailer");

module.exports = async (options) => {
    // Create Transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Set Email Options

    const emailOptions = {
        from: `CafeZero Support <cafezero@support.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // Send Email

    console.log(emailOptions.text);
    await transport.sendMail(emailOptions);
}

