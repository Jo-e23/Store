const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        user: "joeljobyvenn@gmail.com",
        pass: "tygoriiftyrqhgnd"    
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("Nodemailer Connection Error:", error);
    } else {
        console.log("Server is ready to send emails");
    }
});

module.exports = transporter;