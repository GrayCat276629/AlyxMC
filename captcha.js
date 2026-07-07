const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'j67002100@gmail.com',
        pass: 'qas12365'
    }
});

exports.sendCode = functions.https.onCall((data, context) => {
    const { email, code } = data;

    return transporter.sendMail({
        from: 'j67002100@gmail.com',
        to: email,
        subject: 'Alyx Web - Code',
        html: `<h1>Your code: ${code}</h1>`
    });
});